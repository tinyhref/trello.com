import type { FeatureGateKeys } from '@trello/feature-gates';
import { workspaceState } from '@trello/workspace-state';

import {
  getFeatureGatesClientCache,
  getWorkspaceCacheKey,
} from './state/featureGatesClientSharedState';

/**
 * You shouldn't need this. This will attempt to get the feature gate value from
 * the cache, but if everything isn't initialized it may return the wrong value.
 * Carefully consider whether refactoring to use `useFeatureGate` or
 * `getFeatureGateAsync` is possible instead.
 */
export const dangerouslyGetFeatureGateSync = (
  featureGateName: FeatureGateKeys,
) => {
  const featureGatesClientCache = getFeatureGatesClientCache();
  const workspaceId = workspaceState.value.workspaceId;
  const gateValue =
    featureGatesClientCache.value[getWorkspaceCacheKey(workspaceId)]?.gates?.[
      featureGateName
    ];
  return gateValue ?? false;
};
