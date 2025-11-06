import { useEffect, useState } from 'react';

import type { dynamicConfigFlags } from './data/dynamicConfigFlags';
import type { ChangeListener, SupportedFlagTypes } from './dynamicConfig.types';
import { dynamicConfigClient } from './dynamicConfigClientSingleton';

/**
 * Hook used to get the value of a dynamic config flag from Statsig
 * @param flagName
 * @param options object {
 *    sendExposureEvent: boolean - if true, it will call getTrackedVariation and triggerExposureEvent for analytics
 *    attributes: object - additional attributes to pass to analytics
 * }
 *
 * @returns flag value
 */
export const useDynamicConfig = <T extends SupportedFlagTypes>(
  flagName: keyof typeof dynamicConfigFlags,
  options?: {
    sendExposureEvent?: boolean;
    attributes?: object;
  },
): T => {
  // Get the initial value from Statsig dynamic config (it may fall back to the defaultValue)
  // if the Statsig client isn't ready yet
  // By providing the option "sendExposureEvent" it will call getTrackedVariation
  // and triggerExposureEvent for analytics
  const [flag, setFlag] = useState<T>(() =>
    options?.sendExposureEvent
      ? dynamicConfigClient.getTrackedVariation(flagName, options.attributes)
      : dynamicConfigClient.get(flagName),
  );

  // Subscribe to updates from Statsig, and update our flag state with the
  // new value
  useEffect(() => {
    const onFlagChanged: ChangeListener<T> = (newValue?: T): void => {
      if (newValue !== undefined) {
        setFlag(newValue);
      }
    };
    dynamicConfigClient.on(flagName, onFlagChanged);

    // Ensure the subscription is cleaned up when the component is unmounted, or
    // the flagName changes for some reason
    return () => dynamicConfigClient.off(flagName, onFlagChanged);
  }, [flagName]);

  return flag;
};
