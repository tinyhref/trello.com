import { createContext } from 'react';

export const CardIdContext = createContext<string | null>(null);

export const CardIdProvider = CardIdContext.Provider;
