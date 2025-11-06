import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyConfirmEmailBanner: FunctionComponent = () => {
  const ConfirmEmailBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "confirm-email-banner" */ './ConfirmEmailBanner'
      ),
    { namedImport: 'ConfirmEmailBanner', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <ConfirmEmailBanner />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
