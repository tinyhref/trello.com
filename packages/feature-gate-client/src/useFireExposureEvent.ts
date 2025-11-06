import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import {
  featureExperiments,
  type ExperimentVariations,
  type FeatureExperimentKeys,
  type FeatureExperimentParameters,
} from '@trello/feature-gates';
import { deepEqual } from '@trello/objects';
import { useSharedState, useSharedStateSelector } from '@trello/shared-state';
import { workspaceState } from '@trello/workspace-state';

import { ExposureStore } from './ExposureStore';
import { featureGateClientInitializationState } from './featureGateClientInitializationState';
import { useFeatureGate } from './useFeatureGate';
import { useHasPrimaryIdentifier } from './useHasPrimaryIdentifier';
import { useIsFeatureGateClientInitializeCompleted } from './useIsFeatureGateClientInitializeCompleted';

interface LayerOptions<T extends FeatureExperimentKeys> {
  isLayer: true;
  parameterName: FeatureExperimentParameters<T>;
}

export const useFireExposureEvent = <T extends FeatureExperimentKeys>({
  experimentName,
  value,
  fireExposureEvent,
  options,
}: {
  experimentName: T;
  value: ExperimentVariations<T, FeatureExperimentParameters<T>>;
  fireExposureEvent?: boolean;
  options?: LayerOptions<T>;
}) => {
  const isFeatureGateClientInitialized =
    useIsFeatureGateClientInitializeCompleted();
  const hasPrimaryIdentifier = useHasPrimaryIdentifier(experimentName);
  const exposureStore = ExposureStore.getInstance();

  // Get workspace ID for creating a unique key
  const workspaceId = useSharedStateSelector(
    workspaceState,
    useCallback((state) => state.workspaceId, []),
  );

  // Create a unique key for this experiment and workspace
  const experimentKey = `exposure_${experimentName}_${workspaceId ?? 'workspace-agnostic'}`;

  // Get rate limiting feature flag
  const { value: rateLimitingEnabled } = useFeatureGate(
    'trello_xf_exposure_event_rate_limiting',
  );

  // Track previous values for comparison
  const [prevExposureFiredValue, setPrevExposureFiredValue] =
    useState<typeof value>('not-enrolled');
  const prevInitArgs = useRef<typeof currentInitArgs>({
    identifiers: undefined,
    customAttributes: undefined,
  });

  // Get current initialization args
  const [{ identifiers, customAttributes }] = useSharedState(
    featureGateClientInitializationState,
  );

  const currentInitArgs = useMemo(
    () => ({
      identifiers,
      customAttributes,
    }),
    [customAttributes, identifiers],
  );

  const shouldFireExposure = useMemo(() => {
    if (!fireExposureEvent) return false;

    if (!isFeatureGateClientInitialized) return false;

    // If rate limiting is enabled, check the exposure store
    if (rateLimitingEnabled) {
      return !exposureStore.hasRecentExposure(experimentKey, value);
    }

    // Otherwise, check if value changed or init args changed
    return (
      prevExposureFiredValue !== value ||
      !deepEqual(prevInitArgs.current, currentInitArgs)
    );
  }, [
    fireExposureEvent,
    rateLimitingEnabled,
    value,
    experimentKey,
    prevExposureFiredValue,
    isFeatureGateClientInitialized,
    currentInitArgs,
    exposureStore,
  ]);

  const updateTrackingState = useCallback(() => {
    prevInitArgs.current = currentInitArgs;

    if (rateLimitingEnabled) {
      exposureStore.setExposure(experimentKey, value);
    } else {
      setPrevExposureFiredValue(value);
    }
  }, [
    rateLimitingEnabled,
    value,
    experimentKey,
    currentInitArgs,
    exposureStore,
  ]);

  // Fire exposure event
  useEffect(() => {
    if (!shouldFireExposure) return;

    updateTrackingState();

    if (!hasPrimaryIdentifier) {
      Analytics.sendOperationalEvent({
        action: 'cancelled',
        actionSubject: 'fireExposureEvent',
        source: '@trello/feature-gate-client',
        attributes: {
          hasPrimaryIdentifier,
          experimentName,
          primaryIdentifier:
            featureExperiments[experimentName]?.primaryIdentifier,
        },
      });
      return;
    }

    // Fire Statsig exposure event
    if (options?.isLayer) {
      FeatureGates.manuallyLogLayerExposure(
        experimentName,
        options.parameterName as string,
      );
    } else {
      FeatureGates.manuallyLogExperimentExposure(experimentName);
    }

    // Fire GASv3 exposure event
    Analytics.sendTrackEvent({
      action: 'exposed',
      actionSubject: 'feature',
      source: 'trello' as SourceType,
      attributes: {
        experimentName,
        value,
      },
    });
  }, [
    shouldFireExposure,
    experimentName,
    value,
    hasPrimaryIdentifier,
    options?.isLayer,
    options?.parameterName,
    updateTrackingState,
  ]);
};
