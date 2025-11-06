import { useCardDueCompleteFragment } from './CardDueCompleteFragment.generated';

export const useIsCardMarkedComplete = (cardId: string) => {
  const { data } = useCardDueCompleteFragment({ from: { id: cardId } });

  return data?.dueComplete;
};
