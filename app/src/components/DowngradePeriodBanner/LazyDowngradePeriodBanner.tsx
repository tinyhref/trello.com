import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyDowngradePeriodBanner: FunctionComponent = () => {
  const DowngradePeriodBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "downgrade-period-banner" */ './DowngradePeriodBanner'
      ),
    { namedImport: 'DowngradePeriodBanner', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-web-eng',
          feature: 'Banners',
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <DowngradePeriodBanner />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
};
