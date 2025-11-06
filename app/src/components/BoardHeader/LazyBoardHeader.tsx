import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { BoardHeaderProps } from './BoardHeader';

export const LazyBoardHeader: FunctionComponent<BoardHeaderProps> = (props) => {
  const BoardHeader = useLazyComponent(
    () => import(/* webpackChunkName: "board-header" */ './BoardHeader'),
    { namedImport: 'BoardHeader' },
  );

  return (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <BoardHeader {...props} />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
