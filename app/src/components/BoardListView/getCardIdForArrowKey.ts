import { isVisible } from '@trello/dom';
import { client } from '@trello/graphql';
import type { BoardListsContextCardFragment } from '@trello/graphql/fragments';
import { BoardListsContextCardFragmentDoc } from '@trello/graphql/fragments';
import { Key } from '@trello/keybindings';

import { activeCardSharedState } from 'app/src/components/CardFront/activeCardSharedState';
import { CARD_ID_ATTRIBUTE } from 'app/src/components/CardFront/CardFront.constants';
import { visibleCardIdsSharedState } from 'app/src/components/FilterPopover/visibleCardIdsSharedState';
import { activeListIdSharedState } from './activeListIdSharedState';
import {
  getIndexOfCardInList,
  getListCardsTreeWalker,
  getNodeCardId,
} from './getListCardsTreeWalker';
import {
  getListElement,
  getListsTreeWalker,
  getNodeListId,
} from './getListsTreeWalker';

const getRightListId = (listId: string) => {
  const listsWalker = getListsTreeWalker(listId);
  const nextList = listsWalker.nextSibling() ?? undefined;
  return getNodeListId(nextList);
};

const getLeftListId = (listId: string) => {
  const listsWalker = getListsTreeWalker(listId);
  const nextList = listsWalker.previousSibling() ?? undefined;
  return getNodeListId(nextList);
};

/**
 * Get the first visible card on the board.
 *
 * Return null if there are no visible cards on the board.
 */
const getFirstVisibleCardOnBoard = () => {
  const cards = Array.from(document.querySelectorAll(`[${CARD_ID_ATTRIBUTE}]`));
  const visibleCardIds = visibleCardIdsSharedState.value;
  const firstVisibleCard = cards.find((node) => {
    if (!isVisible(node as HTMLElement)) {
      return false;
    }
    const cardId = getNodeCardId(node);
    return cardId ? visibleCardIds.has(cardId) : false;
  });
  return getNodeCardId(firstVisibleCard) ?? null;
};

/**
 * Get the first visible card from the specified list.
 *
 * Return null if there are no visible cards in the list.
 */
const getFirstVisibleCardOnList = (listId: string) => {
  const listElement = getListElement(listId);
  if (!listElement) return null;
  const cards = Array.from(
    listElement.querySelectorAll(`[${CARD_ID_ATTRIBUTE}]`),
  );
  const visibleCardIds = visibleCardIdsSharedState.value;
  const firstVisibleCard = cards.find((node) => {
    if (!isVisible(node as HTMLElement)) {
      return false;
    }
    const cardId = getNodeCardId(node);
    return cardId ? visibleCardIds.has(cardId) : false;
  });
  return getNodeCardId(firstVisibleCard) ?? null;
};

/**
 * Recursively find the first visible card in a list
 * to the left of the specified listId.
 *
 * Return the first visible card of the current list
 * if there are no lists to the left
 *
 * Return null there are no visible cards in any list
 * to the left.
 */
const recurseListsLeft = (listId: string): string | null => {
  let prevListId = listId;
  let currListId = getLeftListId(prevListId) ?? null;
  while (currListId && !getFirstVisibleCardOnList(currListId)) {
    prevListId = currListId;
    currListId = getLeftListId(currListId) ?? null;
  }
  if (!currListId) return getFirstVisibleCardOnList(prevListId);
  const cardId = getFirstVisibleCardOnList(currListId);
  return cardId;
};

/**
 * Recursively find the first visible card in a list
 * to the right of the specified listId.
 *
 * Return the first visible card of the current list
 * if there are no lists to the right
 *
 * Return null there are no visible cards in any list
 * to the right.
 */
const recurseListsRight = (listId: string): string | null => {
  let prevListId = listId;
  let currListId = getRightListId(prevListId) ?? null;
  while (currListId && !getFirstVisibleCardOnList(currListId)) {
    prevListId = currListId;
    currListId = getRightListId(currListId) ?? null;
  }
  if (!currListId) return getFirstVisibleCardOnList(prevListId);
  const cardId = getFirstVisibleCardOnList(currListId);
  return cardId;
};

/**
 * When a user presses a left/right arrow key without a card currently interactive
 * (i.e. nothing hovered or focused), we should focus the first visible card in a
 * list to the left/right respectively.
 *
 * If there are no visible cards in any list to the left/right, we return the first
 * visible card on the current list.
 *
 * Otherwise, we return the first card on the board.
 *
 * If a user presses up/down, we focus the first visible card on the current list,
 * or the first visible card on the board if there are no visible cards on the
 * current list.
 */
const getCardInAdjacentList = (key: ArrowNavigationKey) => {
  const currentListId = activeListIdSharedState.value;
  if (!currentListId) return getFirstVisibleCardOnBoard();
  switch (key) {
    case Key.ArrowLeft: {
      const cardId = recurseListsLeft(currentListId);
      if (cardId) return cardId;
      break;
    }
    case Key.ArrowRight: {
      const cardId = recurseListsRight(currentListId);
      if (cardId) return cardId;
      break;
    }
    default:
      break;
  }

  return (
    getFirstVisibleCardOnList(currentListId) || getFirstVisibleCardOnBoard()
  );
};

/**
 * Finds a card in a list with the closest index matching a given one,
 * which means either an exact match, or the last card in the list.
 */
const getCardInListWithClosestIndex = (listId: string, targetIndex: number) => {
  const cardsWalker = getListCardsTreeWalker(listId);
  let index = 0;

  // Try to find a card in the previous list with a matching index:
  while (cardsWalker.nextNode() !== null && index < targetIndex) {
    index++;
  }

  // Return the current node, which is either a card with the same index,
  // or the last card in the list, either of which work for our purposes.
  const currentNode = cardsWalker.currentNode;
  if (currentNode && currentNode !== cardsWalker.root) {
    return cardsWalker.currentNode;
  }

  return null;
};

type ArrowNavigationKey =
  | typeof Key.ArrowDown
  | typeof Key.ArrowLeft
  | typeof Key.ArrowRight
  | typeof Key.ArrowUp
  // j & k are aliases for down & up, respectively.
  | typeof Key.j
  | typeof Key.k;

/**
 * Given an arrow key, returns a card ID corresponding to the direction and the
 * position of the currently active card. For example, if Card E is active:
 *
 *  ```
 *   A  |  B  |  C
 *   D  | [E] |  F
 *   G  |  H  |  I
 * ```
 *
 * - Pressing the up arrow key should focus Card B.
 * - Pressing the down arrow key should focus Card H.
 * - Pressing the left arrow key should focus Card D.
 * - Pressing the right arrow key should focus Card F.
 *
 * To facilitate this, this function creates {@link https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker TreeWalker}
 * instances on demand that are able to navigate either lists or cards in a list
 * using the `[data-card-id]` and `[data-list-id]` attributes on the elements.
 *
 * This solution should be extremely performant given our node filters, and
 * should align fairly closely with how browser focus actually navigates a page,
 * but it's worth pointing out the sole risk, which is that if we change the
 * data- attributes for lists or cards, _or_ add them to more elements, it could
 * result in unpredictable behavior.
 *
 * See the {@link https://hello.atlassian.net/wiki/spaces/TRFC/pages/2702969474/RFC+Focus+management+on+the+board+canvas#Arrow-keyboard-shortcuts RFC} for more details.
 */
export const getCardIdForArrowKey = (
  key: ArrowNavigationKey,
  cardId = activeCardSharedState.value.idActiveCard,
) => {
  if (!cardId) {
    return getCardInAdjacentList(key);
  }

  const currentListId = client.readFragment<BoardListsContextCardFragment>({
    id: `Card:${cardId}`,
    fragment: BoardListsContextCardFragmentDoc,
  })?.idList;

  if (!currentListId) {
    throw new Error(
      `Tried to navigate from card with ID ${cardId}, but couldn't find its list ID in cache.`,
    );
  }

  switch (key) {
    case Key.ArrowUp:
    case Key.k: {
      const cardsWalker = getListCardsTreeWalker(currentListId, cardId);
      const previousCard = cardsWalker.previousNode();
      return previousCard ? getNodeCardId(previousCard) : null;
    }

    case Key.ArrowDown:
    case Key.j: {
      const cardsWalker = getListCardsTreeWalker(currentListId, cardId);
      const nextCard = cardsWalker.nextNode();
      return nextCard ? getNodeCardId(nextCard) : null;
    }

    case Key.ArrowLeft: {
      const index = getIndexOfCardInList(currentListId, cardId);
      const listsWalker = getListsTreeWalker(currentListId);

      while (listsWalker.previousSibling() !== null) {
        const list = listsWalker.currentNode;
        const listId = getNodeListId(list);
        const cardInList = getCardInListWithClosestIndex(listId!, index);

        if (cardInList) {
          return getNodeCardId(cardInList);
        }
      }

      return null;
    }

    case Key.ArrowRight: {
      const index = getIndexOfCardInList(currentListId, cardId);
      const listsWalker = getListsTreeWalker(currentListId);

      while (listsWalker.nextSibling() !== null) {
        const list = listsWalker.currentNode;
        const listId = getNodeListId(list);
        const cardInList = getCardInListWithClosestIndex(listId!, index);

        if (cardInList) {
          return getNodeCardId(cardInList);
        }
      }
      return null;
    }

    default:
      return null;
  }
};
