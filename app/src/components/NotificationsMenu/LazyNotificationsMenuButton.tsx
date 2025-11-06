import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyNotificationsMenuButton: FunctionComponent = () => {
  const NotificationsMenuButton = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "notifications-menu-button" */ './NotificationsMenuButton'
      ),
    { namedImport: 'NotificationsMenuButton' },
  );

  return (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <NotificationsMenuButton />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
