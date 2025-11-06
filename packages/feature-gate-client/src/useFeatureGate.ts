import { useCallback } from 'react';

import type { FeatureGateKeys } from '@trello/feature-gates';
import { useSharedStateSelector } from '@trello/shared-state';
import { workspaceState } from '@trello/workspace-state';

import {
  getFeatureGatesClientCache,
  getWorkspaceCacheKey,
} from './state/featureGatesClientSharedState';
import { useIsFeatureGateClientInitializeCompleted } from './useIsFeatureGateClientInitializeCompleted';

export const useFeatureGate = (featureGateName: FeatureGateKeys) => {
  const isFeatureGateClientInitializeCompleted =
    useIsFeatureGateClientInitializeCompleted();

  const workspaceId = useSharedStateSelector(
    workspaceState,
    useCallback((state) => state.workspaceId, []),
  );

  const sharedStateGateValue = useSharedStateSelector(
    getFeatureGatesClientCache(),
    useCallback(
      (updateState) => {
        let cachedValue =
          updateState[getWorkspaceCacheKey(workspaceId)]?.gates[
            featureGateName
          ];
        // If the workspace-specific cache doesn't have this key, check the workspace-agnostic cache
        if (typeof cachedValue === 'undefined') {
          cachedValue =
            updateState[getWorkspaceCacheKey()]?.gates[featureGateName];
        }
        return cachedValue;
      },
      [featureGateName, workspaceId],
    ),
  );

  return {
    loading: !isFeatureGateClientInitializeCompleted,
    value: sharedStateGateValue ?? false,
  };
};
