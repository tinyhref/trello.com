import { useContext } from 'react';

import { PlannerEventIdContext } from './PlannerEventIdContext';

export const usePlannerEventId = () => {
  const eventId = useContext(PlannerEventIdContext);

  if (eventId === null) {
    throw new Error(
      'Could not find event ID in the React context. Did you forget to wrap the root component in a <PlannerEventIdProvider>?',
    );
  }

  return eventId;
};
