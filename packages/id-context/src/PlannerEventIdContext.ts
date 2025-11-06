import { createContext } from 'react';

export const PlannerEventIdContext = createContext<string | null>(null);

export const PlannerEventIdProvider = PlannerEventIdContext.Provider;
