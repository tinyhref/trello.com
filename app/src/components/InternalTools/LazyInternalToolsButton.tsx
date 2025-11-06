import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import { useShouldShowInternalTools } from './useShouldShowInternalTools';

export const LazyInternalToolsButton: FunctionComponent = () => {
  const shouldShowInternalTools = useShouldShowInternalTools();
  const InternalToolsButton = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "internal-tools-button" */ './InternalToolsButton'
      ),
    { namedImport: 'InternalToolsButton', preload: shouldShowInternalTools },
  );

  if (!shouldShowInternalTools) {
    return null;
  }

  return (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <InternalToolsButton />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
