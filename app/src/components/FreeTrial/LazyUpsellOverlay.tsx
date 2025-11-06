import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { UpsellOverlayProps } from './UpsellOverlay';

export function LazyUpsellOverlay(props: UpsellOverlayProps) {
  const UpsellOverlay = useLazyComponent(
    () => import(/* webpackChunkName: "upsell-overlay" */ './UpsellOverlay'),
    {
      preload: false,
      namedImport: 'UpsellOverlay',
    },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-web-eng',
          feature: 'Free Trial',
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <UpsellOverlay {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
