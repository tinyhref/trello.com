import { useMemo } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';

import { isNativeCurrentBoardInfoEnabled } from './isNativeCurrentBoardInfoEnabled';

const featureGateName = 'goo_native_graphql_migration_milestone_3';
const defaultGateValue = false;

/**
 * Custom hook to check if the feature gate `'goo_native_graphql_migration_milestone_3'`
 * and its prerequisites are enabled.
 * @returns true if the feature gate is enabled, false otherwise.
 */
export const useNativeGraphqlMigrationMilestone3 = () => {
  const quickloadFlagEnabled = isNativeCurrentBoardInfoEnabled();
  const { value: subscriptionsGateEnabled } = useFeatureGate(
    'gql_client_subscriptions',
  );
  const { value: milestoneGateEnabled } = useFeatureGate(featureGateName);

  return useMemo(
    () =>
      (quickloadFlagEnabled &&
        subscriptionsGateEnabled &&
        milestoneGateEnabled) ??
      defaultGateValue,
    [quickloadFlagEnabled, subscriptionsGateEnabled, milestoneGateEnabled],
  );
};
