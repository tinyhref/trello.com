import { useMemo } from 'react';

import { oneTimeMessagesDismissedState } from '@trello/business-logic-react/member';
import { useSharedState } from '@trello/shared-state';

import { useIsInAddToInboxExperimentCohort } from 'app/src/components/CardFront/useIsInAddToInboxExperimentCohort';
import {
  PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE,
  PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE_DISMISSED,
} from './InboxNotifications.constants';

/**
 * Returns the IDs of the unread discovery cards inbox notifications.
 * @returns The IDs of the unread discovery cards inbox notifications.
 */
export const useUnreadDiscoveryCardsInboxNotifications = () => {
  const [{ oneTimeMessagesDismissed }] = useSharedState(
    oneTimeMessagesDismissedState,
  );

  const { isInAddToInboxExperimentCohort } =
    useIsInAddToInboxExperimentCohort();

  return useMemo(() => {
    if (!isInAddToInboxExperimentCohort) {
      return null;
    }

    const cardIds = oneTimeMessagesDismissed
      .filter((message) =>
        message.startsWith(`${PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE}:`),
      )
      .map((message) =>
        message.replace(`${PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE}:`, ''),
      );
    if (cardIds.length === 0) {
      return null;
    }

    const dismissedCardIds = new Set(
      oneTimeMessagesDismissed
        .filter((message) =>
          message.startsWith(
            `${PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE_DISMISSED}:`,
          ),
        )
        .map((message) =>
          message.replace(
            `${PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE_DISMISSED}:`,
            '',
          ),
        ),
    );

    // Check if there're planner card that don't have a corresponding dismissed message
    const unreadCardNotifications = cardIds.filter(
      (cardId) => !dismissedCardIds.has(cardId),
    );

    return new Set(unreadCardNotifications);
  }, [oneTimeMessagesDismissed, isInAddToInboxExperimentCohort]);
};
