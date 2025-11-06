import { useCallback } from 'react';

import { useSharedStateSelector } from '@trello/shared-state';

import { featureGateClientInitializationState } from './featureGateClientInitializationState';

export const useIsFeatureGateClientInitializeCompleted = () => {
  const isFeatureGateClientInitialized = useSharedStateSelector(
    featureGateClientInitializationState,
    useCallback((state) => state.isInitialized, []),
  );
  return isFeatureGateClientInitialized;
};
