import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyBoardSwitcherDialog: FunctionComponent = () => {
  const BoardSwitcherDialog = useLazyComponent(
    () =>
      import(/* webpackChunkName: "board-switcher" */ './BoardSwitcherDialog'),
    { namedImport: 'BoardSwitcherDialog' },
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
          <BoardSwitcherDialog />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
