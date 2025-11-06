import { getGPUTier } from 'detect-gpu';

import { detectGpuBenchmarkAssetsUrl } from '@trello/config';
import { sendErrorEvent } from '@trello/error-reporting';

import { gpuAcceleratedFeaturesSharedState } from './gpuAcceleratedFeaturesSharedState';

/**
 * Initializes GPU accelerated features based on the device's GPU performance tier.
 *
 * GPU tiers are determined by the detect-gpu library:
 * - Tier 3: ≥ 60fps
 * - Tier 2: ≥ 30fps
 * - Tier 1: ≥ 15fps
 * - Tier 0: < 15fps
 */
export const initializeGpuAcceleratedFeatures = (): Promise<{
  tier: number;
}> => {
  return getGPUTier({ benchmarksURL: detectGpuBenchmarkAssetsUrl })
    .then(({ tier }) => {
      gpuAcceleratedFeaturesSharedState.setValue(tier > 1);
      return { tier };
    })
    .catch((error) => {
      sendErrorEvent(error, {
        tags: {
          ownershipArea: 'trello-platform',
          feature: 'GPU Acceleration',
        },
      });
      return { tier: 0 };
    });
};
