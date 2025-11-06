import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyBrowserUnsupportedBanner: FunctionComponent = () => {
  const BrowserUnsupportedBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "browser-unsupported-banner" */ './BrowserUnsupportedBanner'
      ),
    { namedImport: 'BrowserUnsupportedBanner', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <BrowserUnsupportedBanner />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
