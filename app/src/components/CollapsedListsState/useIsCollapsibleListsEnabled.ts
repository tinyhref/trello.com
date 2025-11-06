import { useIsBoardPremiumFeatureEnabled } from '@trello/business-logic-react/board';
import { PremiumFeatures } from '@trello/entitlements';

export const useIsCollapsibleListsEnabled = (
  boardId: string | undefined,
): boolean => {
  const isCollapsibleListsEnabled = useIsBoardPremiumFeatureEnabled(
    PremiumFeatures.collapsibleLists,
  );

  return isCollapsibleListsEnabled;
};
