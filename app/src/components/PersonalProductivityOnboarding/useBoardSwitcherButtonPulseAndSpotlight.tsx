import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useRecentBoards } from '@trello/recent-boards';

import { useIsEligibleForPlannerDiscoverySpotlight } from 'app/src/components/PlannerDiscoverySpotlight/useIsEligibleForPlannerDiscoverySpotlight';
import { BoardSwitcherButtonSpotlight } from './BoardSwitcherButtonSpotlight';
import {
  BOARD_SWITCHER_SPOTLIGHT_MESSAGE_ID,
  ISLAND_NAV_SPOTLIGHT_MESSAGE_ID,
} from './PersonalProductivityOnboarding.constants';

/**
 * This hook is used to determine if the board switcher spotlight and pulse
 * should be shown. If the user is in the PP cohort, and has the spotlight
 * pulse gate enabled, and has dismissed the island nav spotlight, and has
 * not dismissed the board switcher spotlight, and is not eligible for the
 * planner discovery spotlight.
 *
 * It also returns a function to render the spotlight, in the pattern of the
 * personal productivity spotlight tour.
 *
 * @returns {
 *  renderSingleBoardSwitcherSpotlight: () => React.ReactNode,
 *  shouldShowSpotlight: boolean,
 * }
 */
export const useBoardSwitcherButtonPulseAndSpotlight = () => {
  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();

  // We use the count of recent boards to determine if the user has more than
  // one board, because when they create a board they auto-visit it and that
  // will add it to their recent boards. We mostly care about the number of
  // boards, not the boards themselves. But this does serve to preload the data
  // for BoardSwitcher, so that the contents of the spotlight can be accurately
  // rendered when the spotlight is shown.
  const { data } = useRecentBoards();
  const numBoards = data?.boards?.length ?? 0;

  const {
    value: isPersonalProdEnabled,
    loading: isPersonalProdEnabledLoading,
  } = useFeatureGate('trello_personal_productivity_release');

  const { isEligible: isEligibleForPlannerDiscoverySpotlight } =
    useIsEligibleForPlannerDiscoverySpotlight();

  const renderSingleBoardSwitcherSpotlight = () => {
    return <BoardSwitcherButtonSpotlight />;
  };

  const shouldShowSpotlight =
    isPersonalProdEnabled &&
    !isPersonalProdEnabledLoading &&
    numBoards > 1 &&
    isOneTimeMessageDismissed(ISLAND_NAV_SPOTLIGHT_MESSAGE_ID) &&
    !isOneTimeMessageDismissed(BOARD_SWITCHER_SPOTLIGHT_MESSAGE_ID) &&
    !isEligibleForPlannerDiscoverySpotlight;

  return {
    shouldShowSpotlight,
    renderSingleBoardSwitcherSpotlight,
  };
};
