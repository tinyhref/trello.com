import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyWorkspaceUserLimitBoardBanner: FunctionComponent = () => {
  const WorkspaceUserLimitBoardBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "workspace-user-limit-banner" */ './WorkspaceUserLimitBoardBanner'
      ),
    { namedImport: 'WorkspaceUserLimitBoardBanner', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <WorkspaceUserLimitBoardBanner />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
