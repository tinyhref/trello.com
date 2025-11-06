import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { ConfirmEmailModalProps } from './ConfirmEmailModal';

export const LazyConfirmEmailModal: FunctionComponent<
  ConfirmEmailModalProps
> = (props) => {
  const ConfirmEmailModal = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "confirm-email-modal" */ './ConfirmEmailModal'
      ),
    { preload: false, namedImport: 'ConfirmEmailModal' },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-web-eng',
          feature: 'Confirm Email Modal',
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <ConfirmEmailModal {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
};
