import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export function LazyOverduePaymentBanner() {
  const OverduePaymentBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "overdue-payment-banner" */ './OverduePaymentBanner'
      ),
    { namedImport: 'OverduePaymentBanner', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <OverduePaymentBanner />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
}
