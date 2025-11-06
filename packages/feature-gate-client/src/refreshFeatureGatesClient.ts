import FeatureGates from '@atlaskit/feature-gate-js-client';

import type { FeatureGatesClientWrapperParams } from './featureGatesClientWrapper';
import { featureGatesClientWrapper } from './featureGatesClientWrapper';

let refreshPromise: Promise<void> | undefined = undefined;
let uniq = false;

export const refreshFeatureGatesClient = async (
  params: FeatureGatesClientWrapperParams,
) =>
  featureGatesClientWrapper({ ...params, step: 'refresh' })(
    ({ fetchOptions, identifiers, customAttributes }) => {
      // dirty hack to force a refresh
      uniq = !uniq;
      refreshPromise = FeatureGates.updateUser(fetchOptions, identifiers, {
        uniq,
        ...customAttributes,
      });
      return refreshPromise;
    },
  );
