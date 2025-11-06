import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyReadOnlyBoardModal: FunctionComponent = () => {
  const ReadOnlyBoardModal = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "read-only-board-modal" */ './ReadOnlyBoardModal'
      ),
    { namedImport: 'ReadOnlyBoardModal', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <ReadOnlyBoardModal />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
