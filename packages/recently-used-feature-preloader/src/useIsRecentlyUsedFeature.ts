import { useCallback, useEffect, useMemo } from 'react';

import { PersistentSharedState, useSharedState } from '@trello/shared-state';

import type { FeatureName } from './FeatureName';

/**
 * Shared state that stores the last time a preloadable feature was used.
 * Uses localStorage and isn't gated by member ID or session.
 */
const recentlyUsedFeaturesState = new PersistentSharedState<
  Partial<Record<FeatureName, number>>
>({}, { storageKey: 'recentlyUsedFeatures' });

export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
export const DAYS_UNTIL_EXPIRY = 3 * ONE_DAY_IN_MS;

/**
 * Hook to determine whether a feature was recently used, with a callback
 * to mark a feature "usage." The number of days since last feature usage
 * prerequisite for considering a feature "recently used" is configurable.
 */
export const useIsRecentlyUsedFeature = (
  featureName: FeatureName,
): {
  /** Whether the feature has been used within the last three days. */
  isRecentlyUsedFeature: boolean;
  /** Synchronously marks the feature as recently used with a timestamp. */
  trackFeatureUsage: () => void;
} => {
  const [state, setState] = useSharedState(recentlyUsedFeaturesState);
  const lastUsageTimestamp = state[featureName];

  const isRecentlyUsedFeature = useMemo(
    () =>
      !!lastUsageTimestamp &&
      lastUsageTimestamp + DAYS_UNTIL_EXPIRY >= Date.now(),
    [lastUsageTimestamp],
  );

  // If the feature wasn't recently used, clean it up on unmount.
  const cleanupOnUnmount = !!lastUsageTimestamp && !isRecentlyUsedFeature;
  useEffect(
    () => () => {
      if (cleanupOnUnmount) {
        setState(({ [featureName]: _, ...rest }) => rest);
      }
    },
    [cleanupOnUnmount, featureName, setState],
  );

  return {
    isRecentlyUsedFeature,
    trackFeatureUsage: useCallback(() => {
      setState({ [featureName]: Date.now() });
    }, [featureName, setState]),
  };
};
