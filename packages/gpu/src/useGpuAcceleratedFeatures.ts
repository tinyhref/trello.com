import { useSharedState } from '@trello/shared-state';

import { gpuAcceleratedFeaturesSharedState } from './gpuAcceleratedFeaturesSharedState';

/**
 * Hook to access the current state of GPU accelerated features
 *
 * This hook subscribes to the shared state that tracks whether
 * GPU acceleration is enabled. Components can use this hook to
 * conditionally enable or disable GPU-accelerated features based
 * on the current state.
 */
export const useGpuAcceleratedFeatures = (): boolean => {
  const [isGpuAcceleratedFeaturesEnabled] = useSharedState(
    gpuAcceleratedFeaturesSharedState,
  );

  return isGpuAcceleratedFeaturesEnabled;
};
