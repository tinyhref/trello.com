import type { FunctionComponent, ReactNode } from 'react';
import { createContext, useContext } from 'react';

interface AnalyticsAttributes {
  readonly eventColumn?: string;
  readonly eventComponent?: string;
  readonly eventContainer?: string;
  readonly parentLabel?: string;
}

export const AnalyticsAttributesContext = createContext<AnalyticsAttributes>(
  {},
);

export function useAnalyticsAttributes() {
  return useContext(AnalyticsAttributesContext);
}

interface AnalyticsAttributesProviderProps {
  value: AnalyticsAttributes;
  children?: ReactNode;
}

export const AnalyticsAttributesProvider: FunctionComponent<
  AnalyticsAttributesProviderProps
> = ({ value, children }) => {
  return (
    <AnalyticsAttributesContext.Provider value={value}>
      {children}
    </AnalyticsAttributesContext.Provider>
  );
};
