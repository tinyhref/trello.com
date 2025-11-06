import FeatureGates from '@atlaskit/feature-gate-js-client';
import { Analytics } from '@trello/atlassian-analytics';
import {
  featureExperiments,
  featureGates,
  featureLayers,
  type FeatureExperimentKeys,
  type FeatureGateKeys,
  type FeatureLayersKeys,
} from '@trello/feature-gates';
import { deepEqual } from '@trello/objects';

import { featureGateClientInitializationState } from '../featureGateClientInitializationState';
import type { FeatureGatesValues } from './featureGatesClientSharedState';
import {
  getFeatureGatesClientCache,
  getWorkspaceCacheKey,
} from './featureGatesClientSharedState';

export const updateAllSharedStateFeatureGatesAndExperiments = () => {
  if (!featureGateClientInitializationState.value.isInitialized) {
    return;
  }
  const updatedConfigs: FeatureGatesValues['configs'] = {};
  for (const experimentKey in featureExperiments) {
    const evaluatedExperimentValue =
      // All experiment evaluations don't fire exposure event here, but instead in each consumer
      FeatureGates.getExperiment(experimentKey, {
        fireExperimentExposure: false,
      }).value;
    Analytics.setFlagEvaluation(experimentKey, evaluatedExperimentValue);
    updatedConfigs[experimentKey as FeatureExperimentKeys] =
      evaluatedExperimentValue;
  }

  const updatedGates: FeatureGatesValues['gates'] = {};
  for (const gateKey in featureGates) {
    const evaluatedGateValue = FeatureGates.checkGate(gateKey);
    Analytics.setFlagEvaluation(gateKey, evaluatedGateValue);
    updatedGates[gateKey as FeatureGateKeys] = evaluatedGateValue;
  }

  const updatedLayers: FeatureGatesValues['layers'] = {};
  for (const layerKey in featureLayers) {
    const evaluatedLayerValue =
      // All experiment evaluations don't fire exposure event here, but instead in each consumer
      FeatureGates.getLayer(layerKey, {
        fireLayerExposure: false,
      })._value;
    Analytics.setFlagEvaluation(layerKey, evaluatedLayerValue);
    updatedLayers[layerKey as FeatureLayersKeys] = evaluatedLayerValue;
  }

  const featureGatesClientSharedState = getFeatureGatesClientCache();
  const workspaceKey = featureGateClientInitializationState.value.identifiers
    ? getWorkspaceCacheKey(
        featureGateClientInitializationState.value.identifiers
          .trelloWorkspaceId,
      )
    : undefined;

  const updatedState = {
    configs: updatedConfigs,
    gates: updatedGates,
    layers: updatedLayers,
  };

  if (
    workspaceKey &&
    !deepEqual(featureGatesClientSharedState.value[workspaceKey], updatedState)
  ) {
    featureGatesClientSharedState.setValue({
      [workspaceKey]: updatedState,
    });
  }
};
