import FeatureGates from '@atlaskit/feature-gate-js-client';
import { deepEqual } from '@trello/objects';

import { featureGateClientInitializationState } from './featureGateClientInitializationState';
import {
  featureGatesClientWrapper,
  type FeatureGatesClientWrapperParams,
  type InitParams,
} from './featureGatesClientWrapper';
import { getClientInitQueue } from './getClientInitQueue';

let initPromise: Promise<void> | undefined;

const previousInitArgs = {
  identifiers: {},
  customAttributes: {},
};

/**
 * Using the Feature Gate client, update the user with the provided identifiers and custom attributes.
 * This function will also update the init shared state with the new identifiers and custom attributes.
 */
const updateUser = async ({
  fetchOptions,
  identifiers,
  customAttributes,
}: InitParams): Promise<void> => {
  previousInitArgs.identifiers = identifiers;
  previousInitArgs.customAttributes = customAttributes;

  return FeatureGates.updateUser(
    fetchOptions,
    identifiers,
    customAttributes,
  ).finally(() => {
    featureGateClientInitializationState.setValue({
      identifiers,
      customAttributes,
    });
  });
};

export const initFeatureGatesClient = async (
  params: FeatureGatesClientWrapperParams,
) => {
  const clientInitQueue = getClientInitQueue();

  return clientInitQueue.enqueue(() =>
    featureGatesClientWrapper({ ...params, step: 'init' })((initParams) => {
      const { fetchOptions, identifiers, customAttributes } = initParams;

      if (!FeatureGates.initializeCalled()) {
        previousInitArgs.identifiers = identifiers;
        previousInitArgs.customAttributes = customAttributes;
        initPromise = FeatureGates.initialize(
          fetchOptions,
          identifiers,
          customAttributes,
        ).finally(() => {
          featureGateClientInitializationState.setValue({
            isInitialized: true,
            identifiers,
            customAttributes,
          });
        });
      } else if (
        !deepEqual(previousInitArgs, { identifiers, customAttributes })
      ) {
        // If the client hasn't finished initializing, we should subscribe to the state change before
        // updating the user.
        if (!FeatureGates.initializeCompleted()) {
          initPromise = new Promise((resolve) => {
            const unsubscribe = featureGateClientInitializationState.subscribe(
              (value) => {
                if (value.isInitialized) {
                  updateUser(initParams).finally(() => {
                    unsubscribe();
                    resolve();
                  });
                }
              },
            );
          });
        } else {
          initPromise = updateUser(initParams);
        }
      }
      return initPromise;
    }),
  );
};
