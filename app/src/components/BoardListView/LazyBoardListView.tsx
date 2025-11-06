import type { FunctionComponent } from 'react';

import { useLazyComponent } from '@trello/use-lazy-component';

import { BoardViewBoundary } from 'app/src/components/Board/BoardViewBoundary';

export const LazyBoardListView: FunctionComponent = () => {
  const BoardListView = useLazyComponent(
    () => import(/* webpackChunkName: "board-list-view" */ './BoardListView'),
    {
      preload: false,
      namedImport: 'BoardListView',
    },
  );

  return (
    <BoardViewBoundary feature="Board List View" ownershipArea="trello-web-eng">
      <BoardListView />
    </BoardViewBoundary>
  );
};
