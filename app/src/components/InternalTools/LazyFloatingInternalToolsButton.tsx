import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import { useShouldShowInternalTools } from './useShouldShowInternalTools';

export const LazyFloatingInternalToolsButton: FunctionComponent = () => {
  const shouldShowInternalTools = useShouldShowInternalTools();
  const FloatingInternalToolsButton = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "floating-internal-tools-button" */ './FloatingInternalToolsButton'
      ),
    {
      namedImport: 'FloatingInternalToolsButton',
      preload: shouldShowInternalTools,
    },
  );

  if (!shouldShowInternalTools) {
    return null;
  }

  return (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <FloatingInternalToolsButton />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
