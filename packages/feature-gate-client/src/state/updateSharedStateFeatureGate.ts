import FeatureGates from '@atlaskit/feature-gate-js-client';
import type { FeatureGateKeys } from '@trello/feature-gates';

import { featureGateClientInitializationState } from '../featureGateClientInitializationState';
import {
  getFeatureGatesClientCache,
  getWorkspaceCacheKey,
} from './featureGatesClientSharedState';

export const updateSharedStateFeatureGate = (gate?: FeatureGateKeys) => {
  if (!featureGateClientInitializationState.value.isInitialized) {
    return;
  }
  if (!gate) {
    return;
  }

  const workspaceKey = featureGateClientInitializationState.value.identifiers
    ? getWorkspaceCacheKey(
        featureGateClientInitializationState.value.identifiers
          .trelloWorkspaceId,
      )
    : undefined;
  if (workspaceKey) {
    getFeatureGatesClientCache().setValue((prevValue) => ({
      ...prevValue,
      [workspaceKey]: {
        ...prevValue[workspaceKey],
        gates: {
          ...prevValue[workspaceKey]?.gates,
          [gate]: FeatureGates.checkGate(gate),
        },
      },
    }));
  }
};
