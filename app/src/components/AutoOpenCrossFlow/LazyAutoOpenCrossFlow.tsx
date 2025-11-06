import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import { useAutoOpenCrossFlow } from './useAutoOpenCrossFlow';

export const LazyAutoOpenCrossFlow: FunctionComponent = () => {
  const { wouldRender } = useAutoOpenCrossFlow();

  const AutoOpenCrossFlowWithProvider = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "auto-open-cross-flow" */ './AutoOpenCrossFlowWithProvider'
      ),
    { namedImport: 'AutoOpenCrossFlowWithProvider', preload: false },
  );

  if (!wouldRender) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <AutoOpenCrossFlowWithProvider />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
