import type { RegisteredFeatureKey } from '@trello/feature-gates';

import type { TouchpointSourceType } from '../TouchpointSourceType';

type Extends<T, TSubType extends T> = TSubType;

// For Statsig experiments only
export type CrossFlowFeatureKeys = Extends<
  RegisteredFeatureKey,
  'xf_de_facto_bandits_grs_trello_feature_integration'
>;

// For Statsig experiments only
export const featureTouchpoints: Record<
  CrossFlowFeatureKeys,
  TouchpointSourceType[]
> = {
  ['xf_de_facto_bandits_grs_trello_feature_integration']: ['boardScreen'],
};

export const isSourceTargetedByFeatureKey = ({
  featureKey,
  source,
}: {
  featureKey: CrossFlowFeatureKeys;
  source: TouchpointSourceType;
}) => featureTouchpoints[featureKey]?.includes(source);
