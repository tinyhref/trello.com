import type { FeatureGateKeys } from '@trello/feature-gates';
import { workspaceState } from '@trello/workspace-state';

import {
  getFeatureGatesClientCache,
  getWorkspaceCacheKey,
} from './state/featureGatesClientSharedState';

/**
 * Async method for doing a one-time async fetch of a feature gate value.
 * Waits for the client to be initialized before returning the value.
 */
export const getFeatureGateAsync = async (
  featureGateName: FeatureGateKeys,
): Promise<boolean> => {
  return new Promise((resolve) => {
    const featureGatesClientCache = getFeatureGatesClientCache();
    const getFeatureGateFromCacheAsync = (
      workspaceId: typeof workspaceState.value.workspaceId,
    ): Promise<boolean> => {
      return new Promise((res) => {
        const gateValue =
          featureGatesClientCache.value[getWorkspaceCacheKey(workspaceId)]
            ?.gates?.[featureGateName];
        if (gateValue !== undefined) {
          res(gateValue);
          return;
        }
        // cache is empty, wait for value to be set.
        const unsubscribe = featureGatesClientCache.subscribe((state) => {
          const val =
            state[getWorkspaceCacheKey(workspaceId)]?.gates?.[featureGateName];
          if (val !== undefined) {
            res(val);
            unsubscribe();
          }
        });
      });
    };
    if (!workspaceState.value.isLoading) {
      resolve(getFeatureGateFromCacheAsync(workspaceState.value.workspaceId));
      return;
    }
    const unsubscribe = workspaceState.subscribe((state) => {
      if (!state.isLoading) {
        resolve(getFeatureGateFromCacheAsync(state.workspaceId));
        unsubscribe();
      }
    });
  });
};
