import { getMemberId } from '@trello/authentication';
import type {
  ExperimentVariations,
  FeatureExperimentKeys,
  FeatureExperimentParameters,
  FeatureGateKeys,
  FeatureLayerParameters,
  FeatureLayersKeys,
  LayerVariations,
} from '@trello/feature-gates';
import { SharedState } from '@trello/shared-state';
import { TrelloStorage } from '@trello/storage';

export interface FeatureGatesValues {
  configs: Partial<{
    [K in FeatureExperimentKeys]: {
      [P in FeatureExperimentParameters<K>]?: ExperimentVariations<K, P>;
    };
  }>;
  gates: Partial<Record<FeatureGateKeys, boolean>>;
  layers: Partial<{
    [K in FeatureLayersKeys]: {
      [P in FeatureLayerParameters<K>]?: LayerVariations<K, P>;
    };
  }>;
}

export const getWorkspaceCacheKey = (workspaceId?: string | null) => {
  return workspaceId ?? 'workspace-agnostic';
};

interface FeatureGatesCachedValues {
  [workspaceId: string]: FeatureGatesValues;
}

let featureGatesClientSharedState: SharedState<FeatureGatesCachedValues>;

const initFeatureGateSharedState = () => {
  const sharedState = new SharedState<FeatureGatesCachedValues>(
    TrelloStorage.get(`featureGates-${getMemberId()}`) ?? {},
  );

  sharedState.subscribe(
    (state) => {
      TrelloStorage.set(`featureGates-${getMemberId()}`, state);
    },
    { onlyUpdateIfChanged: true },
  );

  return sharedState;
};

export const getFeatureGatesClientCache = () => {
  if (!featureGatesClientSharedState) {
    featureGatesClientSharedState = initFeatureGateSharedState();
  }

  return featureGatesClientSharedState;
};
