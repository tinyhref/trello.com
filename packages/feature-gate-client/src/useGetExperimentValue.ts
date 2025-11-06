import { useCallback, useRef } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import type {
  ExperimentVariations,
  FeatureExperimentKeys,
  FeatureExperimentParameters,
  FeatureLayerParameters,
  FeatureLayersKeys,
} from '@trello/feature-gates';
import { useSharedStateSelector } from '@trello/shared-state';
import { workspaceState } from '@trello/workspace-state';

import {
  getFeatureGatesClientCache,
  getWorkspaceCacheKey,
} from './state/featureGatesClientSharedState';
import { useFireExposureEvent } from './useFireExposureEvent';
import { useIsFeatureGateClientInitializeCompleted } from './useIsFeatureGateClientInitializeCompleted';

const notEnrolled = 'not-enrolled';

export interface UseGetExperimentValueArgs<TExperimentKey, TExperimentParam> {
  experimentName: TExperimentKey;
  parameter: TExperimentParam;
  fireExposureEvent?: boolean;
  options?: {
    isLayer: boolean;
  };
}

export const useGetExperimentValue = <
  TExperimentKey extends FeatureExperimentKeys,
  TExperimentParam extends FeatureExperimentParameters<TExperimentKey>,
>({
  experimentName,
  parameter,
  fireExposureEvent,
  options = { isLayer: false },
}: UseGetExperimentValueArgs<TExperimentKey, TExperimentParam>): Record<
  TExperimentParam,
  ExperimentVariations<TExperimentKey, TExperimentParam>
> & {
  loading: boolean;
} => {
  const isFeatureGateClientInitializeCompleted =
    useIsFeatureGateClientInitializeCompleted();

  const workspaceId = useSharedStateSelector(
    workspaceState,
    useCallback((state) => state.workspaceId, []),
  );

  const prevExperimentConfigAttribute = useRef<{
    experimentName: TExperimentKey;
    workspaceKey: string;
    isValueSetForWorkspace: boolean;
    experimentConfig: object | undefined;
    parameter:
      | ExperimentVariations<TExperimentKey, TExperimentParam>
      | undefined;
  }>();

  const sharedStateExperimentValue = useSharedStateSelector(
    getFeatureGatesClientCache(),
    useCallback(
      (updateState) => {
        if (options.isLayer) {
          return updateState[getWorkspaceCacheKey(workspaceId)]?.layers?.[
            experimentName as FeatureLayersKeys
          ]?.[parameter as FeatureLayerParameters<FeatureLayersKeys>];
        }

        const experimentConfigAttribute = {
          experimentName,
          workspaceKey: getWorkspaceCacheKey(workspaceId),
          isValueSetForWorkspace:
            !!updateState[getWorkspaceCacheKey(workspaceId)],
          experimentConfig:
            updateState[getWorkspaceCacheKey(workspaceId)]?.configs[
              experimentName
            ],
          parameter:
            updateState[getWorkspaceCacheKey(workspaceId)]?.configs[
              experimentName
            ]?.[parameter],
        };

        const sharedStateParameterValue =
          updateState[getWorkspaceCacheKey(workspaceId)]?.configs[
            experimentName
          ]?.[parameter];

        if (
          (sharedStateParameterValue === undefined ||
            sharedStateParameterValue === null) &&
          prevExperimentConfigAttribute.current?.parameter !== undefined && // This hook returned a valid experiment value before.
          fireExposureEvent
        ) {
          Analytics.sendOperationalEvent({
            action: 'retrieved',
            actionSubject: 'experiment',
            attributes: {
              ...experimentConfigAttribute,
              prevExperimentConfigAttribute:
                prevExperimentConfigAttribute.current,
            },
            source: 'lib:featureGateClient',
          });
        }
        prevExperimentConfigAttribute.current = experimentConfigAttribute;

        return sharedStateParameterValue;
      },
      [
        experimentName,
        fireExposureEvent,
        options.isLayer,
        parameter,
        workspaceId,
      ],
    ),
  );

  const experimentValue = sharedStateExperimentValue ?? notEnrolled;

  useFireExposureEvent({
    experimentName,
    value: experimentValue,
    fireExposureEvent,
    options: options.isLayer
      ? {
          isLayer: true,
          parameterName: parameter,
        }
      : undefined,
  });

  // type casted because parameter is not recognized to be of type P.
  const parameterObj = {
    [parameter as TExperimentParam]: experimentValue,
  } as Record<
    TExperimentParam,
    ExperimentVariations<TExperimentKey, TExperimentParam>
  >;

  return {
    ...parameterObj,
    loading: !isFeatureGateClientInitializeCompleted,
  };
};
