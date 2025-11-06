import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyExportToJwmBanner = () => {
  const ExportToJwmBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "export-to-jwm-banner" */ 'app/src/components/ExportToJwmBanner'
      ),
    { namedImport: 'ExportToJwmBanner', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <ExportToJwmBanner />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
