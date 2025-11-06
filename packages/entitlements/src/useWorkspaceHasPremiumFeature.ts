import { usePremiumFeaturesWorkspaceFragment } from './PremiumFeaturesWorkspaceFragment.generated';
import type { PremiumFeature } from './types';

export const useWorkspaceHasPremiumFeature = (
  workspaceId: string,
  feature: PremiumFeature,
) => {
  const { data } = usePremiumFeaturesWorkspaceFragment({
    from: { id: workspaceId },
  });
  if (!data?.premiumFeatures?.length) {
    return false;
  }
  return data.premiumFeatures.includes(feature);
};
