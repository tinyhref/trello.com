import type { FunctionComponent } from 'react';
import { Suspense, useCallback } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import { ErrorContentDialog } from './ErrorContentDialog';
import type { RequestAccessConfirmationModalProps } from './RequestAccessConfirmationModal';

export const LazyRequestAccessConfirmationModal: FunctionComponent<
  RequestAccessConfirmationModalProps
> = (props: RequestAccessConfirmationModalProps) => {
  const RequestAccessConfirmationModal = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "request-access-confirmation-modal" */ './RequestAccessConfirmationModal'
      ),
    { preload: false, namedImport: 'RequestAccessConfirmationModal' },
  );

  const errorHandler = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (errorBoundaryProps: any) => (
      <ErrorContentDialog {...errorBoundaryProps} handleClick={props.onClose} />
    ),
    [props.onClose],
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-web-eng',
          feature: 'requestAccessV3',
        }}
        errorHandlerComponent={errorHandler}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <RequestAccessConfirmationModal {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
};
