import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { UpgradeSmartComponentProps } from './UpgradeSmartComponent';

export function LazyUpgradeSmartComponent(props: UpgradeSmartComponentProps) {
  const UpgradeSmartComponent = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "upgrade-smart-component" */ './UpgradeSmartComponent'
      ),
    {
      preload: false,
      namedImport: 'UpgradeSmartComponent',
    },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Upgrade Prompts',
      }}
    >
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <UpgradeSmartComponent {...props} />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
}
