import type { FunctionComponent } from 'react';

import { useBoardId } from '@trello/id-context';
import { LazyBoardScreenPlacement } from '@trello/post-office-placements';

import { BoardListsContextProvider } from 'app/src/components/BoardListsContext';
import { BoardLists } from './BoardLists';
import { useBoardFilterSearchParams } from './useBoardFilterSearchParams';

export const BoardListView: FunctionComponent = () => {
  const boardId = useBoardId();
  // sets up listeners on card data to handle determining which
  // card ids are visible to the user dependent on filtering state.
  useBoardFilterSearchParams(boardId);

  return (
    <BoardListsContextProvider>
      <BoardLists />
      <LazyBoardScreenPlacement />
    </BoardListsContextProvider>
  );
};
