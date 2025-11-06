import type { FunctionComponent } from 'react';
import { useCallback, useMemo } from 'react';

import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useBoardId, useCardId } from '@trello/id-context';
import { useSharedStateSelector } from '@trello/shared-state';
import type { CardFrontTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useIsInAddToInboxExperimentCohort } from 'app/src/components/CardFront/useIsInAddToInboxExperimentCohort';
import {
  PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE,
  PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE_DISMISSED,
} from 'app/src/components/InboxNotifications/InboxNotifications.constants';
import { notificationsState } from 'app/src/components/NotificationsMenu';
import { ArchivedBadge } from './ArchivedBadge';
import { AtlassianIntelligenceBadge } from './AtlassianIntelligenceBadge';
import { AttachmentsBadge } from './AttachmentsBadge';
import { useCardFrontBadgesBoardFragment } from './CardFrontBadgesBoardFragment.generated';
import { useCardFrontBadgesCardFragment } from './CardFrontBadgesCardFragment.generated';
import { ChecklistsBadge } from './ChecklistsBadge';
import { CommentsBadge } from './CommentsBadge';
import { CustomFieldBadges } from './CustomFieldBadges';
import { DescriptionBadge } from './DescriptionBadge';
import { DueDateBadgeWrapper } from './DueDateBadge';
import { ExternalSourceBadge } from './ExternalSourceBadge';
import { LocationBadge } from './LocationBadge';
import { MaliciousAttachmentsBadge } from './MaliciousAttachmentsBadge';
import { NotificationsBadge } from './NotificationsBadge';
import { PlannerDiscoveryBadge } from './PlannerDiscoveryBadge';
import { PluginBadges } from './PluginBadges';
import { SubscribedBadge } from './SubscribedBadge';
import { TemplateBadge } from './TemplateBadge';
import { TrelloAttachmentsBadge } from './TrelloAttachmentsBadge';
import { VotesBadge } from './VotesBadge';

import * as styles from './CardFrontBadges.module.less';

interface CardFrontBadgesProps {
  showPluginBadges?: boolean;
  showDates?: boolean;
}

export const CardFrontBadges: FunctionComponent<CardFrontBadgesProps> = ({
  showPluginBadges = true,
  showDates = true,
}) => {
  const cardId = useCardId();
  const boardId = useBoardId();
  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();

  const { data: cardData } = useCardFrontBadgesCardFragment({
    from: { id: cardId },
    optimistic: true,
    returnPartialData: true,
  });

  const { data: boardData } = useCardFrontBadgesBoardFragment({
    from: { id: boardId },
    optimistic: true,
  });

  const { badges, closed, isTemplate } = cardData ?? {};
  const recurrenceRule = cardData?.recurrenceRule;
  const {
    attachments,
    attachmentsByType,
    checkItems,
    checkItemsChecked,
    checkItemsEarliestDue,
    comments,
    description,
    externalSource,
    lastUpdatedByAi,
    location,
    maliciousAttachments,
    subscribed,
    votes,
    viewingMemberVoted,
    due,
    start,
    dueComplete,
  } = badges || {};

  const { hideVotes, isTemplate: boardIsTemplate } = boardData?.prefs || {};

  const { value: isPersonalProductivityEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );

  const { isInAddToInboxExperimentCohort: inGhostAddToInboxExperiment } =
    useIsInAddToInboxExperimentCohort();

  const [trelloAttachments, nonTrelloAttachments] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let trelloAttachments = 0;
    if (attachmentsByType) {
      const { card, board } = attachmentsByType.trello;
      trelloAttachments = (card ?? 0) + (board ?? 0);
    }
    return [
      trelloAttachments,
      attachments ? Math.max(attachments - trelloAttachments, 0) : 0,
    ];
  }, [attachments, attachmentsByType]);

  const unreadNotifications = useSharedStateSelector(
    notificationsState,
    useCallback(({ unreadCount }) => unreadCount[`Card:${cardId}`], [cardId]),
  );

  // This is for an experimental, non permanent feature
  // Show Planner Discovery badge for cards that originated from the discovery flow
  // Counter-intuitive: badge appears AFTER the discovery message is dismissed
  // This serves as a "origin marker" indicating the card came from Planner Discovery
  const showsPlannerDiscoveryBadge = useMemo(() => {
    if (!cardId) return false;

    // When user dismisses the planner discovery message, we mark this card permanently
    return (
      isOneTimeMessageDismissed(
        `${PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE}:${cardId}`,
      ) ||
      isOneTimeMessageDismissed(
        `${PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE_DISMISSED}:${cardId}`,
      )
    );
  }, [cardId, isOneTimeMessageDismissed]);

  return (
    <div
      className={styles.badges}
      data-testid={getTestId<CardFrontTestIds>('card-front-badges')}
    >
      <TemplateBadge isTemplate={isTemplate} />
      {inGhostAddToInboxExperiment && (
        <PlannerDiscoveryBadge
          isPlannerDiscoveryCard={showsPlannerDiscoveryBadge}
        />
      )}
      <NotificationsBadge unreadNotifications={unreadNotifications} />
      {isPersonalProductivityEnabled && (
        <ExternalSourceBadge externalSource={externalSource} />
      )}
      <AtlassianIntelligenceBadge
        lastUpdatedByAi={lastUpdatedByAi}
        externalSource={externalSource}
      />
      <SubscribedBadge subscribed={subscribed} />
      <VotesBadge
        votes={votes}
        isTemplate={isTemplate}
        viewingMemberVoted={viewingMemberVoted}
        hideVotes={hideVotes}
      />
      {showDates && (
        <DueDateBadgeWrapper
          due={due}
          start={start}
          dueComplete={dueComplete}
          isTemplate={isTemplate}
          isRepeating={recurrenceRule?.rule ? true : false}
        />
      )}
      <DescriptionBadge description={description} />
      <CommentsBadge comments={comments} isBoardTemplate={boardIsTemplate} />
      <AttachmentsBadge attachments={nonTrelloAttachments} />
      <TrelloAttachmentsBadge attachments={trelloAttachments} />
      <MaliciousAttachmentsBadge maliciousAttachments={maliciousAttachments} />
      <ChecklistsBadge
        total={checkItems}
        completed={checkItemsChecked}
        due={checkItemsEarliestDue}
      />
      <ArchivedBadge closed={closed} />
      <LocationBadge location={location} />
      <CustomFieldBadges />
      {showPluginBadges && <PluginBadges />}
    </div>
  );
};
