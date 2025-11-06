import { useMemo } from 'react';

import { useCalendarId, usePlannerEventId } from '@trello/id-context';

import { usePlannerEventCardsFragment } from './PlannerEventCardsFragment.generated';

export const useSortedPlannerEventCards = () => {
  const eventId = usePlannerEventId();
  const calendarId = useCalendarId();

  const { data } = usePlannerEventCardsFragment({
    from: { id: eventId, plannerCalendarId: calendarId },
  });

  const associatedCards = useMemo(() => {
    return [...(data?.cards?.edges || [])]
      .filter((card) => card.node?.card?.id !== undefined)
      .sort((a, b) => (a?.node?.position ?? 0) - (b?.node?.position ?? 0));
  }, [data?.cards?.edges]);

  return { ...data, cards: { ...data?.cards, edges: associatedCards } };
};
