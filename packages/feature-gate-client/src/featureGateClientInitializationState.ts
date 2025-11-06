import type {
  CustomAttributes,
  Identifiers,
} from '@atlaskit/feature-gate-js-client';
import { SharedState } from '@trello/shared-state';

interface FeatureGateClientInitializationState {
  isInitialized: boolean;
  identifiers?: Identifiers;
  customAttributes?: CustomAttributes;
}
export const featureGateClientInitializationState =
  new SharedState<FeatureGateClientInitializationState>({
    isInitialized: false,
  });
