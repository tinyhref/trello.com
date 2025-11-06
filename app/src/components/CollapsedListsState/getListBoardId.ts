import { client } from '@trello/graphql';

import type { ListBoardIdFragment } from './ListBoardIdFragment.generated';
import { ListBoardIdFragmentDoc } from './ListBoardIdFragment.generated';

export const getListBoardId = (listId: string): string | null =>
  client.readFragment<ListBoardIdFragment>({
    fragment: ListBoardIdFragmentDoc,
    id: `List:${listId}`,
  })?.idBoard ?? null;
