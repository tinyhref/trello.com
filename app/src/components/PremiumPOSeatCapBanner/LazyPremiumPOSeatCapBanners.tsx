import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyPremiumPOSeatCapBanners: FunctionComponent = () => {
  const PremiumPOSeatCapBanners = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "premium-po-seat-cap-banners" */ './PremiumPOSeatCapBanners'
      ),
    { namedImport: 'PremiumPOSeatCapBanners', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <PremiumPOSeatCapBanners />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
