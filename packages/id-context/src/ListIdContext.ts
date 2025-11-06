import { createContext } from 'react';

export const ListIdContext = createContext<string | null>(null);

export const ListIdProvider = ListIdContext.Provider;
