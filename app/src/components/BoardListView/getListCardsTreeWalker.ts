import { CARD_ID_ATTRIBUTE } from 'app/src/components/CardFront/CardFront.constants';
import { getListElement } from './getListsTreeWalker';

export const getCardElement = (cardId?: string | null) =>
  // eslint-disable-next-line @trello/no-query-selector
  cardId ? document.querySelector(`[${CARD_ID_ATTRIBUTE}="${cardId}"]`) : null;
export const getNodeCardId = (node?: Node | null) =>
  (node as HTMLElement)?.dataset.cardId;

const isNodeHidden = (node?: Node | null) =>
  (node as HTMLElement)?.hasAttribute('hidden');

/**
 * Creates a TreeWalker of all the card elements in a list.
 * This can be used for easily navigating across cards in a list.
 */
export const getListCardsTreeWalker = (
  listId: string,
  currentCardId?: string,
) => {
  const list = getListElement(listId);
  if (!list) {
    throw new Error(`List with ID ${listId} could not be found.`);
  }

  const cardsWalker = document.createTreeWalker(
    list,
    NodeFilter.SHOW_ELEMENT,
    (node) => {
      // Don't search within cards or hidden nodes; skip to the next one.
      if (isNodeHidden(node) || getNodeCardId(node.parentNode as Node)) {
        return NodeFilter.FILTER_REJECT;
      }
      return getNodeCardId(node)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP;
    },
  );

  const currentCard = getCardElement(currentCardId);
  if (currentCard) {
    cardsWalker.currentNode = currentCard;
  }
  return cardsWalker;
};

/**
 * Starting from a given card in the list, walk up the list and count how
 * far we are from the beginning to determine the index of the original card.
 */
export const getIndexOfCardInList = (
  listId: string,
  cardId: string,
): number => {
  const cardsWalker = getListCardsTreeWalker(listId, cardId);
  let index = 0;

  while (cardsWalker.previousNode() !== null) {
    index++;
  }

  return index;
};
