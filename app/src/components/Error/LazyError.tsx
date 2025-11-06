import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { ErrorProps } from './Error.types';

export const LazyError: FunctionComponent<ErrorProps> = (props) => {
  const Error = useLazyComponent(
    () => import(/* webpackChunkName: "error" */ 'app/src/components/Error'),
    { namedImport: 'Error' },
  );
  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <Error {...props} />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
