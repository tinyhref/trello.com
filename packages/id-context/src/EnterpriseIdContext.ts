import { createContext } from 'react';

export const EnterpriseIdContext = createContext<string | null>(null);

export const EnterpriseIdProvider = EnterpriseIdContext.Provider;
