import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { SmartListProps } from './SmartList';
import { SmartListSkeleton } from './SmartListSkeleton';

export const LazySmartList: FunctionComponent<SmartListProps> = (props) => {
  const SmartList = useLazyComponent(
    () => import(/* webpackChunkName: "smart-list" */ './SmartList'),
    { namedImport: 'SmartList', preload: false },
  );
  return (
    <Suspense fallback={<SmartListSkeleton />}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-enterprise',
          feature: 'Smart List',
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <SmartList {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
};
