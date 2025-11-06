import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyBoardSwitcherPanel: FunctionComponent = () => {
  const BoardSwitcherPanel = useLazyComponent(
    () =>
      import(/* webpackChunkName: "board-switcher" */ './BoardSwitcherPanel'),
    { namedImport: 'BoardSwitcherPanel' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Board Switcher',
      }}
    >
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <BoardSwitcherPanel />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
