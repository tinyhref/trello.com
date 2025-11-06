import { useCardRecurrenceFragment } from './CardRecurrenceFragment.generated';

export const useCardHasRecurrence = (cardId: string) => {
  const { data } = useCardRecurrenceFragment({ from: { id: cardId } });

  return data?.recurrenceRule?.rule;
};
