import { client } from '@trello/graphql';

import type { ListVisibleCardsQuery } from './ListVisibleCardsQuery.generated';
import { ListVisibleCardsDocument } from './ListVisibleCardsQuery.generated';

/**
 * Reads cards associated with a list directly from the cache at runtime.
 * This method is preferred to a query hook in most cases, as subscribing to
 * this query would trigger rerenders on every change to cards in a board.
 */
export const readListVisibleCardsFromCache = ({
  boardId,
  listId,
}: {
  boardId: string;
  listId: string;
}) => {
  const data = client.readQuery<ListVisibleCardsQuery>({
    query: ListVisibleCardsDocument,
    variables: { boardId },
  });
  const cards =
    data?.board?.cards
      ?.filter((card) => card.idList === listId)
      ?.sort((a, b) => a.pos - b.pos) ?? [];
  return [...cards];
};
