import { createContext } from 'react';

export const MirrorCardIdContext = createContext<string | null>(null);

export const MirrorCardIdProvider = MirrorCardIdContext.Provider;
