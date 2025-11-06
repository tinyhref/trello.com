import { usePremiumFeaturesBoardFragment } from './PremiumFeaturesBoardFragment.generated';
import type { PremiumFeature } from './types';

export const useBoardHasPremiumFeature = (
  boardId: string,
  feature: PremiumFeature,
) => {
  const { data } = usePremiumFeaturesBoardFragment({ from: { id: boardId } });
  if (!data?.premiumFeatures?.length) {
    return false;
  }
  return data.premiumFeatures.includes(feature);
};
