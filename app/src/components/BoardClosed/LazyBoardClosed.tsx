import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyBoardClosed: FunctionComponent = () => {
  const BoardClosed = useLazyComponent(
    () => import(/* webpackChunkName: "board-closed" */ './BoardClosed'),
    {
      preload: false,
      namedImport: 'BoardClosed',
    },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-web-eng',
          feature: 'Board Closed',
        }}
      >
        <BoardClosed />
      </ErrorBoundary>
    </Suspense>
  );
};
