import { type FunctionComponent, Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyPremiumTrialPaymentModalOverlay: FunctionComponent = () => {
  const PremiumTrialPaymentModalOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "premium-trial-payment-modal" */ 'app/src/components/PremiumTrialPaymentModalOverlay'
      ),
    { namedImport: 'PremiumTrialPaymentModalOverlay', preload: false },
  );

  return (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <PremiumTrialPaymentModalOverlay />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
