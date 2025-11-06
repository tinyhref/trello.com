import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazySkipNavigation: FunctionComponent = () => {
  const SkipNavigation = useLazyComponent(
    () => import(/* webpackChunkName: "skip-navigation" */ './SkipNavigation'),
    { namedImport: 'SkipNavigation' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
      }}
    >
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <SkipNavigation />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
