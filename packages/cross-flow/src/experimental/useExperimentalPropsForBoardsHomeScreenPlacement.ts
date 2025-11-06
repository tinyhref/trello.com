import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';

import { useHasEligibleWorkspaces } from './runtimeEligibilityChecks/useHasEligibleWorkspaces';
import { useIsNotProductivityUserOrIsEligible } from './runtimeEligibilityChecks/useIsNotProductivityUserOrIsEligible';

export const useExperimentalPropsForBoardsHomeScreenPlacement = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  // 1. Get eligible workspaces
  const { eligibleWorkspaceOptions } = useHasEligibleWorkspaces({
    workspaceId,
    entitlementRequired: 'standardOrPremium',
    treatFreeTrialAsFree: true,
  });

  // 2. Check if member is eligible against personal productivity checks
  const { isEligible: isPersonalProductivityEligible } =
    useIsNotProductivityUserOrIsEligible('boardsHomeCarouselAd');

  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();

  // 3. Check if member dismissed ad before
  const isAdDismissed = isOneTimeMessageDismissed(
    '1p-discovery-ad-left-hand-nav-board-home',
  );

  return {
    eligibleWorkspaceOptions,
    isPersonalProductivityEligible,
    isAdDismissed,
  };
};
