import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyLoggedInPublicBoardBanner: FunctionComponent = () => {
  const LoggedInPublicBoardBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "logged-in-public-board-banner" */ './LoggedInPublicBoardBanner'
      ),
    { namedImport: 'LoggedInPublicBoardBanner', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <LoggedInPublicBoardBanner />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
