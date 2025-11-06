import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazySandboxEnterpriseBanner: FunctionComponent = () => {
  const SandboxEnterpriseBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "sandbox-enterprise-banner" */ './SandboxEnterpriseBanner'
      ),
    { namedImport: 'SandboxEnterpriseBanner', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <SandboxEnterpriseBanner />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
