import type { FunctionComponent } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { UFOSuspense } from '@trello/ufo';
import { useLazyComponent } from '@trello/use-lazy-component';

import { HeaderSkeleton } from 'app/src/components/HeaderSkeleton';
import type { AuthenticatedHeaderProps } from './AuthenticatedHeader';

const Null = () => null;

export const LazyAuthenticatedHeader: FunctionComponent<
  AuthenticatedHeaderProps
> = (props) => {
  const AuthenticatedHeader = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "authenticated-header" */ './AuthenticatedHeader'
      ),
    { namedImport: 'AuthenticatedHeader' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Authenticated Header',
      }}
      errorHandlerComponent={Null}
    >
      <ChunkLoadErrorBoundary fallback={<HeaderSkeleton />}>
        <UFOSuspense
          name={'authenticated-global-header-view'}
          fallback={<HeaderSkeleton />}
        >
          <AuthenticatedHeader {...props} />
        </UFOSuspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
