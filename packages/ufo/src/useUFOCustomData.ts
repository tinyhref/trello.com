import { useContext } from 'react';

import { addUFOCustomData } from '@atlaskit/react-ufo/custom-data';

import { UFOGateContext } from './UFOGate';

/**
 * Add Custom Data directly to future UFO events.
 *
 * A feature gate can be specified in a parent {@link UFOGateContext} to return the children directly in cases where
 * the gate is false for incremental rollout. For a hook-less variant of this function, use {@link addUFOCustomData}.
 *
 * @param data An arbitrary object containing the data that should be added to future UFO events.
 */
export const useUFOCustomData = (
  data: Parameters<typeof addUFOCustomData>[0],
) => {
  const featureGateEnabled = useContext(UFOGateContext);

  if (!featureGateEnabled) {
    return;
  }

  addUFOCustomData(data);
};
