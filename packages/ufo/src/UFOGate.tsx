import { createContext, useMemo, type PropsWithChildren } from 'react';

import { dangerouslyGetFeatureGateSync } from '@trello/feature-gate-client';
import type { FeatureGateKeys } from '@trello/feature-gates';

export const UFOGateContext = createContext(true);

interface UFOGateProviderProps {
  featureGate: FeatureGateKeys;
}

/**
 * A context provider that can be used to enable or disable all UFO functionality for child components based on the value
 * of the specified feature gate. Can be used to incrementally roll out enhanced UFO functionality.
 *
 * @param featureGate The name of the feature gate to check.
 */
export const UFOGateProvider = ({
  featureGate,
  children,
}: PropsWithChildren<UFOGateProviderProps>) => {
  const featureGateEnabled = useMemo(() => {
    return dangerouslyGetFeatureGateSync(featureGate);
  }, [featureGate]);

  return (
    <UFOGateContext.Provider value={featureGateEnabled}>
      {children}
    </UFOGateContext.Provider>
  );
};
