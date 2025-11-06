import {
  getListCardsTreeWalker,
  getNodeCardId,
} from './getListCardsTreeWalker';

export const getNextCardIdInList = (
  currentListId: string,
  currentCardId: string,
) => {
  const cardsWalker = getListCardsTreeWalker(currentListId, currentCardId);
  const nextCard = cardsWalker.nextNode();
  return nextCard ? getNodeCardId(nextCard) : null;
};
