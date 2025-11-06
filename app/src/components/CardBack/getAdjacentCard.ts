/* eslint-disable @trello/export-matches-filename */

import { client } from '@trello/graphql';

import { visibleCardIdsSharedState } from 'app/src/components/FilterPopover/visibleCardIdsSharedState';
import { readListVisibleCardsFromCache } from 'app/src/components/List/readListVisibleCardsFromCache';
import type { CardBackContextIdsFragment } from './CardBackContextIdsFragment.generated';
import { CardBackContextIdsFragmentDoc } from './CardBackContextIdsFragment.generated';

const getListCards = (cardId: string) => {
  const data = client.readFragment<CardBackContextIdsFragment>({
    fragment: CardBackContextIdsFragmentDoc,
    id: `Card:${cardId}`,
  });

  if (!data?.idBoard || !data?.idList) {
    return [];
  }

  return readListVisibleCardsFromCache({
    boardId: data.idBoard,
    listId: data.idList,
  });
};

/**
 * Given a card ID, return the previous visible card in its list via navigation.
 * This is used by the router-aware card back for arrow key navigation.
 *
 * @param cardId The ID of the card to navigate from.
 * @returns The ID of the previous card, if it exists.
 */
export const getPreviousCard = (cardId: string) => {
  const listCards = getListCards(cardId);
  const cardIndex = listCards.findIndex((card) => card.id === cardId);
  const visibleCardIds = visibleCardIdsSharedState.value;

  if (cardIndex === -1 || !visibleCardIds.size) {
    return;
  }

  for (let i = cardIndex - 1; i >= 0; i--) {
    const card = listCards[i];
    if (visibleCardIdsSharedState.value.has(card.id)) {
      return card.id;
    }
  }
};

/**
 * Given a card ID, return the next visible card in its list via navigation.
 * This is used by the router-aware card back for arrow key navigation.
 *
 * @param cardId The ID of the card to navigate from.
 * @returns The ID of the next card, if it exists.
 */
export const getNextCard = (cardId: string) => {
  const listCards = getListCards(cardId);
  const cardIndex = listCards.findIndex((card) => card.id === cardId);
  const visibleCardIds = visibleCardIdsSharedState.value;

  if (cardIndex === -1 || !visibleCardIds.size) {
    return;
  }

  for (let i = cardIndex + 1; i < listCards.length; i++) {
    const card = listCards[i];
    if (visibleCardIdsSharedState.value.has(card.id)) {
      return card.id;
    }
  }
};
