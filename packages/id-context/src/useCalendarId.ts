import { useContext } from 'react';

import { CalendarIdContext } from './CalendarIdContext';

export const useCalendarId = () => {
  const calendarId = useContext(CalendarIdContext);

  if (calendarId === null) {
    throw new Error(
      'Could not find calendar ID in the React context. Did you forget to wrap the root component in a <CalendarIdProvider>?',
    );
  }

  return calendarId;
};
