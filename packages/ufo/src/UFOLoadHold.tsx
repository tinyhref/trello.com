import { kebabCase } from 'change-case';
import { useContext, type FunctionComponent } from 'react';

import _UFOLoadHold from '@atlaskit/react-ufo/load-hold';

import type { LoadHoldKey } from './experiences';
import { UFOGateContext } from './UFOGate';

/**
 * A UFO load hold component that prevents UFO from completing measurements. Should only be used within a UFOSegment.
 *
 * This component creates a load hold that tells UFO to wait before completing
 * performance measurements for the named segment. Load holds are useful for
 * indicating that content is still loading and measurements should be delayed.
 *
 * A feature gate can be specified in a parent {@link UFOGateContext} to return the children directly in cases where
 * the gate is false for incremental rollout.
 *
 * @param name - The name of the segment to apply the load hold to.
 *
 * @example
 * ```tsx
 * function AsyncContent() {
 *   const [isLoading, setIsLoading] = useState(true);
 *
 *   return (
 *     <div>
 *       {isLoading && <UFOLoadHold name="async-content" />}
 *       <AsyncDataComponent onLoad={() => setIsLoading(false)} />
 *     </div>
 *   );
 * }
 * ```
 */
export const UFOLoadHold: FunctionComponent<{ name: LoadHoldKey }> = ({
  name,
}) => {
  const featureGateEnabled = useContext(UFOGateContext);

  if (!featureGateEnabled) {
    return null;
  }

  return <_UFOLoadHold name={kebabCase(name)} />;
};
