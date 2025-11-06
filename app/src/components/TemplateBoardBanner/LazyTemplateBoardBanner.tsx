import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyTemplateBoardBanner: FunctionComponent = () => {
  const TemplateBoardBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "template-board-banner" */ './TemplateBoardBanner'
      ),
    { namedImport: 'TemplateBoardBanner', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <TemplateBoardBanner />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
