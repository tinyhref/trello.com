import type { FunctionComponent } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { UFOSuspense } from '@trello/ufo';
import { useLazyComponent } from '@trello/use-lazy-component';

import { HeaderSkeleton } from 'app/src/components/HeaderSkeleton';

const Null = () => null;

export const LazyLoggedOutHeader: FunctionComponent = () => {
  const LoggedOutHeader = useLazyComponent(
    () =>
      import(/* webpackChunkName: "logged-out-header" */ './LoggedOutHeader'),
    { namedImport: 'LoggedOutHeader' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Logged-Out Header',
      }}
      errorHandlerComponent={Null}
    >
      <ChunkLoadErrorBoundary fallback={<HeaderSkeleton />}>
        <UFOSuspense
          name={'unauthenticated-global-header-view'}
          fallback={<HeaderSkeleton />}
        >
          <LoggedOutHeader />
        </UFOSuspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
