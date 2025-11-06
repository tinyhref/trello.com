import { createContext } from 'react';

export const PlannerAccountIdContext = createContext<string | null>(null);

export const PlannerAccountIdProvider = PlannerAccountIdContext.Provider;
