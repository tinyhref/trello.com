import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useState } from 'react';

import LikeIcon from '@atlaskit/icon/core/thumbs-up';
import { Analytics } from '@trello/atlassian-analytics';
import { useDynamicConfig } from '@trello/dynamic-config';
import {
  AiLabsEntryPointId,
  useFeedbackCollector as useJiraFeedbackCollector,
} from '@trello/feedback-collector';
import { Button } from '@trello/nachos/button';
import { showFlag } from '@trello/nachos/experimental-flags';
import { CloseIcon } from '@trello/nachos/icons/close';

import type { FeatureNames } from './featuresInfo';
import { NegativeFeedbackDetail } from './NegativeFeedbackDetail';
import { useFeedbackCollector } from './useFeedbackCollector';

import * as styles from './FeedbackCollector.module.less';

interface FeedbackCollectorProps {
  featureName: FeatureNames;
  traceId?: string;
  flagTreatment?: boolean;
  useAsyncShowBehavior?: boolean;
}

export const FeedbackCollector: FunctionComponent<FeedbackCollectorProps> = ({
  featureName,
  traceId,
  flagTreatment,
  useAsyncShowBehavior,
}) => {
  const [shouldShowFeedbackDetail, setShouldShowFeedbackDetail] =
    useState(false);
  const [selectedThumbButton, setSelectedThumbButton] = useState<
    'down' | 'up' | null
  >(null);
  const [wasFeedbackSubmitted, setWasFeedbackSubmitted] =
    useState<boolean>(false);

  const isInternalAtlassian = useDynamicConfig('trello_web_atlassian_team');
  const {
    getFeedbackCollectorProjectKey,
    isOpen,
    hideFeedbackCollector,
    showFeedbackCollector,
    traceId: sharedStateTraceId,
  } = useFeedbackCollector({
    featureName,
  });

  useEffect(() => {
    if (useAsyncShowBehavior) {
      hideFeedbackCollector();
    } else {
      // ensure that we show feedback collector if useAsyncShowBehavior is false, otherwise it will not show
      showFeedbackCollector();
    }
    // We only want to run this on initial render, as setup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actualTraceId = traceId ?? sharedStateTraceId;

  const getFeedbackContextOverride = useCallback(() => {
    return getFeedbackCollectorProjectKey();
  }, [getFeedbackCollectorProjectKey]);

  const {
    FeedbackCollector: JiraFeedbackCollector,
    showFeedbackCollector: showJiraFeedbackCollector,
  } = useJiraFeedbackCollector({
    entrypointId: AiLabsEntryPointId,
    source: 'aiLabsFeedbackCollector',
    feedbackCollectorProps: {
      feedbackTitle: 'Share your thoughts on how Rovo did',
    },
    getFeedbackContextOverride,
  });

  const handleThumbsUp = useCallback(() => {
    setShouldShowFeedbackDetail(false);
    setSelectedThumbButton(selectedThumbButton === 'up' ? null : 'up');

    Analytics.sendClickedButtonEvent({
      buttonName: 'aiLabsFeedbackCollectorThumbsUpButton',
      source: 'aiLabsFeedbackCollector',
      attributes: {
        aiLabsFeatureName: featureName || '',
        aiLabsSentimentModifier: 1, // Assuming positive sentiment for thumbs up
        taskId: actualTraceId,
      },
    });

    if (flagTreatment) {
      hideFeedbackCollector();

      showFlag({
        id: 'aiLabsFeedbackCollectorSuccessMessage',
        title: 'Thank you for your feedback!',
        appearance: 'success',
        isAutoDismiss: true,
        msTimeout: 2000,
      });
    }

    setWasFeedbackSubmitted(true);
  }, [
    selectedThumbButton,
    featureName,
    actualTraceId,
    flagTreatment,
    hideFeedbackCollector,
  ]);

  const handleThumbsDown = useCallback(() => {
    setShouldShowFeedbackDetail(true);
    setSelectedThumbButton(selectedThumbButton === 'down' ? null : 'down');

    Analytics.sendClickedButtonEvent({
      buttonName: 'aiLabsFeedbackCollectorThumbsDownButton',
      source: 'aiLabsFeedbackCollector',
      attributes: {
        aiLabsFeatureName: featureName || '',
        aiLabsSentimentModifier: -1, // Assuming negative sentiment for thumbs down
        taskId: actualTraceId,
      },
    });
  }, [featureName, selectedThumbButton, actualTraceId]);

  const handleFlagClose = useCallback(() => {
    hideFeedbackCollector();
  }, [hideFeedbackCollector]);

  const handleFeedbackSubmitted = useCallback(() => {
    if (flagTreatment) {
      hideFeedbackCollector();

      showFlag({
        id: 'aiLabsFeedbackCollectorSuccessMessage',
        title: 'Thank you for your feedback!',
        appearance: 'success',
        isAutoDismiss: true,
        msTimeout: 2000,
      });
    }

    setWasFeedbackSubmitted(true);
  }, [flagTreatment, hideFeedbackCollector]);

  if (!isInternalAtlassian || (flagTreatment && !isOpen)) {
    return null;
  }

  const feedbackCollectorContents = (
    <>
      <JiraFeedbackCollector />
      <div className={styles.feedbackButtonsContainer}>
        <div className={styles.titleAndCloseButton}>
          <span>How did Rovo do?</span>

          {flagTreatment && (
            <Button className={styles.closeButton} onClick={handleFlagClose}>
              <CloseIcon label="Close feedback collector" />
            </Button>
          )}
        </div>
        <div>
          <Button
            onClick={handleThumbsUp}
            className={cx(styles.positiveFeedbackButton, {
              [styles.selected]: selectedThumbButton === 'up',
            })}
          >
            <LikeIcon label={'Valuable'} spacing="spacious"></LikeIcon>
          </Button>
          <Button
            onClick={handleThumbsDown}
            className={cx(styles.negativeFeedbackButton, {
              [styles.selected]: selectedThumbButton === 'down',
            })}
          >
            <LikeIcon label={'Not valuable'} spacing="spacious"></LikeIcon>
          </Button>
        </div>
        <Button onClick={showJiraFeedbackCollector} appearance="link">
          Provide detailed feedback
        </Button>
      </div>

      {shouldShowFeedbackDetail && (
        <NegativeFeedbackDetail
          featureName={featureName}
          traceId={actualTraceId}
          feedbackSubmissionCallback={handleFeedbackSubmitted}
          flagTreatment={flagTreatment}
        />
      )}
    </>
  );

  const thankYouMessage = <p>Thank you for your feedback!</p>;

  return (
    <div
      className={cx(styles.feedbackCollectorContainer, {
        [styles.flagTreatment]: flagTreatment,
      })}
    >
      {!wasFeedbackSubmitted && feedbackCollectorContents}
      {wasFeedbackSubmitted && thankYouMessage}
    </div>
  );
};
