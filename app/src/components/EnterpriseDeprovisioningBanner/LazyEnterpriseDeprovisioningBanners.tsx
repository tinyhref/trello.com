import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyEnterpriseDeprovisioningBanners: FunctionComponent = () => {
  const EnterpriseDeprovisioningBanners = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "enterprise-deprovisioning-banners" */ './EnterpriseDeprovisioningBanners'
      ),
    { namedImport: 'EnterpriseDeprovisioningBanners', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <EnterpriseDeprovisioningBanners />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
