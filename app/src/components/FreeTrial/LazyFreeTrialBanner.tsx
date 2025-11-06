import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export function LazyFreeTrialBanner() {
  const FreeTrialBanner = useLazyComponent(
    () =>
      import(/* webpackChunkName: "free-trial-banner" */ './FreeTrialBanner'),
    {
      preload: false,
      namedImport: 'FreeTrialBanner',
    },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-web-eng',
          feature: 'Free Trial',
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <FreeTrialBanner />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
