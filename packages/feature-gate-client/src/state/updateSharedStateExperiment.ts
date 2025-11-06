import FeatureGates from '@atlaskit/feature-gate-js-client';
import type { FeatureExperimentKeys } from '@trello/feature-gates';

import { featureGateClientInitializationState } from '../featureGateClientInitializationState';
import {
  getFeatureGatesClientCache,
  getWorkspaceCacheKey,
} from './featureGatesClientSharedState';

export const updateSharedStateExperiment = (
  experiment?: FeatureExperimentKeys,
) => {
  if (!featureGateClientInitializationState.value.isInitialized) {
    return;
  }
  if (!experiment) {
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
        configs: {
          ...prevValue[workspaceKey]?.configs,
          [experiment]: FeatureGates.getExperiment(experiment, {
            fireExperimentExposure: false,
          }).value,
        },
      },
    }));
  }
};
