import { type FunctionComponent, Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyPremiumTrialModalOverlay: FunctionComponent = () => {
  const PremiumTrialModalOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "premium-trial-modal" */ 'app/src/components/PremiumTrialModalOverlay'
      ),
    { namedImport: 'PremiumTrialModalOverlay', preload: false },
  );

  return (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <PremiumTrialModalOverlay />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
