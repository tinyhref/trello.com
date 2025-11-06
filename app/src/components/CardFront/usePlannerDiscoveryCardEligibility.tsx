import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';

import {
  PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE,
  PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE_DISMISSED,
} from 'app/src/components/InboxNotifications/InboxNotifications.constants';
import { useIsInAddToInboxExperimentCohort } from './useIsInAddToInboxExperimentCohort';

export const usePlannerDiscoveryCardEligibility: ({
  cardId,
}: {
  cardId: string;
}) =>
  | {
      isEligible: false;
      variation: null;
    }
  | {
      isEligible: true;
      variation: 'with-cta' | 'without-cta';
    } = ({ cardId }) => {
  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();

  const { isInAddToInboxExperimentCohort, addToInboxCohort } =
    useIsInAddToInboxExperimentCohort();

  if (
    !isInAddToInboxExperimentCohort ||
    !(
      isOneTimeMessageDismissed(
        `${PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE}:${cardId}`,
      ) ||
      isOneTimeMessageDismissed(
        `${PLANNER_DISCOVERY_CARD_ONE_TIME_MESSAGE_DISMISSED}:${cardId}`,
      )
    )
  ) {
    return {
      isEligible: false,
      variation: null,
    };
  } else {
    const variation =
      addToInboxCohort === 'treatment-a' ? 'with-cta' : 'without-cta';
    return {
      isEligible: true,
      variation,
    };
  }
};
