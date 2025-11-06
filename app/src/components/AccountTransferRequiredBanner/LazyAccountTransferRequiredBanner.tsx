import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyAccountTransferRequiredBanner: FunctionComponent = () => {
  const AccountTransferRequiredBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "account-transfer-required-banner" */ './AccountTransferRequiredBanner'
      ),
    { namedImport: 'AccountTransferRequiredBanner', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <AccountTransferRequiredBanner />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
