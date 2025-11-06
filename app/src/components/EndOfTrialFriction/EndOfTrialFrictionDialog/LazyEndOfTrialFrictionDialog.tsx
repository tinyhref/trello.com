import { type FunctionComponent, Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyEndOfTrialFrictionDialog: FunctionComponent = () => {
  const EndOfTrialFrictionDialog = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "premium-trial-modal" */ 'app/src/components/EndOfTrialFriction/EndOfTrialFrictionDialog/EndOfTrialFrictionDialog'
      ),
    { namedImport: 'EndOfTrialFrictionDialog', preload: false },
  );

  return (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <EndOfTrialFrictionDialog />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
