import { useCallback, useEffect, useMemo, useRef } from 'react';
// eslint-disable-next-line no-restricted-imports
import { isBefore, parse } from 'date-fns';

import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { useMemberId } from '@trello/authentication';
import { idToDate } from '@trello/dates';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { PersistentSharedState, useSharedState } from '@trello/shared-state';

import { useAcknowledgeNewFeatureMutation } from './AcknowledgeNewFeatureMutation.generated';
import type { NewFeature } from './FeatureRolloutConfig';
import { DATE_FORMAT, FeatureRolloutConfig } from './FeatureRolloutConfig';
import { useNewFeatureQuery } from './NewFeatureQuery.generated';

/**
 * Formats an ID to be stored in oneTimeMessagesDismissed.
 * Retains the feature ID and expiration date in ms,
 * for the sake of potentially cleaning up oneTimeMessagesDismissed
 * programmatically after expiration dates have passed.
 *
 * @param featureId
 * @returns {string} messageId
 */
export const getOneTimeMessageId = (
  featureId: NewFeature,
): `ack-new-feature-${NewFeature}-${number}` => {
  const [, expirationDate] = FeatureRolloutConfig[featureId];
  const expirationDateInMs = parse(
    expirationDate,
    DATE_FORMAT,
    new Date(),
  ).valueOf();
  return `ack-new-feature-${featureId}-${expirationDateInMs}`;
};

export const seenFeaturesSessionKey = 'newFeaturesSeen';
type SeenFeaturesState = Partial<Record<NewFeature, boolean>>;

const seenFeaturesState = new PersistentSharedState<SeenFeaturesState>(
  {},
  { storageKey: seenFeaturesSessionKey, session: true },
);

interface UseNewFeatureHookResult {
  isNewFeature: boolean;
  acknowledgeNewFeature: (options: {
    source: SourceType;
    explicit?: boolean;
  }) => void;
}

/**
 * Determines whether a given feature is "new" for the current user, usually
 * for the sake of in-app messaging or bucketing. Uses a combination of the
 * user's start date (i.e. whether the user is newer than the feature),
 * a predetermined length of time for a feature to be marked as new,
 * and the user's oneTimeMessagesDismissed, which indicates whether they've
 * seen or interacted with the feature.
 *
 * Recently seen features remain marked new for the duration of the session
 * via SessionStorage unless explicitly dismissed.
 * @param featureId
 */
export const useNewFeature = (
  featureId: NewFeature,
): UseNewFeatureHookResult => {
  const memberId = useMemberId();
  const { data } = useNewFeatureQuery({
    variables: { memberId },
    waitOn: ['MemberHeader'],
  });
  const [mutate] = useAcknowledgeNewFeatureMutation();
  const [seenFeatures, setSeenFeatures] = useSharedState(seenFeaturesState);

  const isNewFeature: boolean = useMemo(() => {
    if (!data?.member?.id) {
      // Default to false; this should always be a noncritical enhancement.
      return false;
    }
    const { id, oneTimeMessagesDismissed } = data.member;
    const signupDate = idToDate(id);
    const [releaseDate, expirationDate] = FeatureRolloutConfig[featureId];
    if (
      // If the feature rolled out before the user joined, return false;
      // this feature is as new as the rest of Trello is to them.
      isBefore(parse(releaseDate, DATE_FORMAT, new Date()), signupDate) ||
      // The feature is no longer new!
      isBefore(parse(expirationDate, DATE_FORMAT, new Date()), Date.now())
    ) {
      return false;
    }
    const messageId = getOneTimeMessageId(featureId);
    // Evaluate messageId existence without expiration date in case the
    // expiration date has been extended.
    const messageIdWithoutExpirationDate = messageId.slice(
      0,
      messageId.lastIndexOf('-') + 1,
    );
    const hasDismissedMessageId = oneTimeMessagesDismissed?.some((message) =>
      message.startsWith(messageIdWithoutExpirationDate),
    );
    return !hasDismissedMessageId;
  }, [data?.member, featureId]);

  const hasSentOperationalEvent = useRef(false);
  useEffect(() => {
    if (isNewFeature && !hasSentOperationalEvent.current) {
      Analytics.sendOperationalEvent({
        action: 'exposed',
        actionSubject: 'newFeature',
        source: getScreenFromUrl(),
        attributes: { featureId },
      });
      hasSentOperationalEvent.current = true;
    }
  }, [featureId, isNewFeature, hasSentOperationalEvent]);

  const acknowledgeNewFeature = useCallback<
    UseNewFeatureHookResult['acknowledgeNewFeature']
  >(
    async ({ source, explicit = false }) => {
      const { [featureId]: hasSeenFeature, ...rest } = seenFeatures ?? {};
      if (isNewFeature) {
        const messageId = getOneTimeMessageId(featureId);
        await mutate({ variables: { memberId, messageId } });
        setSeenFeatures({ ...rest, [featureId]: !explicit });
      } else if (explicit && hasSeenFeature === true) {
        // An explicit acknowledgement can supercede previous implicit acks.
        setSeenFeatures({ ...rest, [featureId]: false });
      } else {
        // Don't fire analytics event if this was a noop.
        return;
      }
      Analytics.sendTrackEvent({
        action: 'acknowledged',
        actionSubject: 'newFeature',
        source,
        attributes: {
          featureId,
          explicit,
        },
      });
    },
    [featureId, isNewFeature, memberId, mutate, seenFeatures, setSeenFeatures],
  );

  return {
    // If the feature was only seen this session (and not explicitly dismissed),
    // it's still new for the duration of the session.
    isNewFeature: isNewFeature || !!seenFeatures?.[featureId],
    acknowledgeNewFeature,
  };
};
