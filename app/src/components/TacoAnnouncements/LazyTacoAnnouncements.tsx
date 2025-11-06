import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyTacoAnnouncements: FunctionComponent = () => {
  const TacoAnnouncements = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "taco-announcements" */ './TacoAnnouncements'
      ),
    { namedImport: 'TacoAnnouncements' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Taco Announcements',
      }}
    >
      <Suspense fallback={null}>
        <ChunkLoadErrorBoundary fallback={null}>
          <TacoAnnouncements />
        </ChunkLoadErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  );
};
