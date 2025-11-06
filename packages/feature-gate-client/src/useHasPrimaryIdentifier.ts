import {
  featureExperiments,
  type FeatureExperimentKeys,
  type FeatureExperimentPrimaryIdentifiers,
} from '@trello/feature-gates';
import { useSharedState } from '@trello/shared-state';

import { featureGateClientInitializationState } from './featureGateClientInitializationState';

/**
 * Returns true if and only if the shared state data in the statsig client contains the primary
 * identifier of the statsig experiment, as stated in the experiment definition in featureGates.ts.
 *
 * This is to avoid firing exposures on experiments which use a primary identifier
 * (such as Trello workspace id) which is not reliably set in the statsig client at all times
 */
export const useHasPrimaryIdentifier = <T extends FeatureExperimentKeys>(
  experimentName: T,
): boolean => {
  const [featureGateClientInitState] = useSharedState(
    featureGateClientInitializationState,
  );

  switch (
    featureExperiments[experimentName]
      ?.primaryIdentifier as FeatureExperimentPrimaryIdentifiers
  ) {
    case 'atlassianAccountId': {
      return !!featureGateClientInitState.identifiers?.atlassianAccountId;
    }
    case 'analyticsAnonymousId': {
      return !!featureGateClientInitState.identifiers?.analyticsAnonymousId;
    }
    case 'trelloWorkspaceId': {
      return !!featureGateClientInitState.identifiers?.trelloWorkspaceId;
    }
    default: {
      return true;
    }
  }
};
