import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyEnterpriseNotificationBanners: FunctionComponent = () => {
  const EnterpriseNotificationBanners = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "enterprise-notification-banners" */ './EnterpriseNotificationBanners'
      ),
    { namedImport: 'EnterpriseNotificationBanners', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <EnterpriseNotificationBanners />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
