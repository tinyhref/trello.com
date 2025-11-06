/* eslint-disable @trello/export-matches-filename */

import { client } from '@trello/graphql';

import type { BoardOpenListsFragment } from 'app/src/components/BoardListView/BoardOpenListsFragment.generated';
import { BoardOpenListsFragmentDoc } from 'app/src/components/BoardListView/BoardOpenListsFragment.generated';
import type { CardBackContextIdsFragment } from './CardBackContextIdsFragment.generated';
import { CardBackContextIdsFragmentDoc } from './CardBackContextIdsFragment.generated';

const getLists = (boardId: string) => {
  const data = client.readFragment<BoardOpenListsFragment>({
    fragment: BoardOpenListsFragmentDoc,
    id: `Board:${boardId}`,
  });

  if (!data?.lists.length) {
    return [];
  }

  return [...data.lists].sort((a, b) => a.pos - b.pos);
};

/**
 * Given a card ID, return the previous list ID in the board.
 *
 * @param cardId The ID of the card to navigate from.
 * @returns The ID of the previous list, if it exists.
 */
export const getPreviousList = (cardId: string) => {
  const context = client.readFragment<CardBackContextIdsFragment>({
    fragment: CardBackContextIdsFragmentDoc,
    id: `Card:${cardId}`,
  });

  if (!context?.idBoard || !context?.idList) {
    return;
  }

  const lists = getLists(context.idBoard);
  const listIndex = lists.findIndex((list) => list.id === context.idList);

  return lists[listIndex - 1]?.id;
};

/**
 * Given a card ID, return the next list ID in the board.
 *
 * @param cardId The ID of the card to navigate from.
 * @returns The ID of the next list, if it exists.
 */
export const getNextList = (cardId: string) => {
  const context = client.readFragment<CardBackContextIdsFragment>({
    fragment: CardBackContextIdsFragmentDoc,
    id: `Card:${cardId}`,
  });

  if (!context?.idBoard || !context?.idList) {
    return;
  }

  const lists = getLists(context.idBoard);
  const listIndex = lists.findIndex((list) => list.id === context.idList);

  return lists[listIndex + 1]?.id;
};
