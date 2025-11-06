import { createContext } from 'react';

export const CalendarIdContext = createContext<string | null>(null);

export const CalendarIdProvider = CalendarIdContext.Provider;
