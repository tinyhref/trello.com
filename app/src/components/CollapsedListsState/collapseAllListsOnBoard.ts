import { client } from '@trello/graphql';

import type { BoardOpenListsFragment } from 'app/src/components/BoardListView/BoardOpenListsFragment.generated';
import { BoardOpenListsFragmentDoc } from 'app/src/components/BoardListView/BoardOpenListsFragment.generated';
import type { CollapsedListStateType } from './collapsedListsState';
import { collapsedListsState, CollapsedListState } from './collapsedListsState';

export const collapseAllListsOnBoard = (boardId: string) => {
  const data = client.readFragment<BoardOpenListsFragment>({
    fragment: BoardOpenListsFragmentDoc,
    id: `Board:${boardId}`,
  });
  const lists = data?.lists;
  if (!lists?.length) {
    return;
  }

  const value: Record<string, CollapsedListStateType> = {};
  lists.forEach((list) => {
    value[list.id] = CollapsedListState.Collapsed;
  });

  collapsedListsState.setValue((state) => {
    state[boardId] = value;
    return state;
  });
};
