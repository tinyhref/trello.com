import {
  PremiumFeatures,
  useWorkspaceHasPremiumFeature,
} from '@trello/entitlements';
import { useWorkspaceId } from '@trello/id-context';

export const useGetMirrorCardPaidStatus = () => {
  const workspaceId = useWorkspaceId();

  //TODO: Refactor isPaid naming: https://trello.atlassian.net/browse/TJC-3683
  const isPaid = useWorkspaceHasPremiumFeature(
    workspaceId || '',
    PremiumFeatures.premiumMirrorCards,
  );

  return isPaid;
};
