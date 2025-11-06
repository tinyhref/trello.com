import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyClosedBoardBanner: FunctionComponent = () => {
  const ClosedBoardBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "closed-board-banner" */ './ClosedBoardBanner'
      ),
    { namedImport: 'ClosedBoardBanner', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <ClosedBoardBanner />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
