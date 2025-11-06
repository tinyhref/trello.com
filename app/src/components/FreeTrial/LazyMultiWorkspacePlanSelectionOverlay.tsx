import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { MultiWorkspacePlanSelectionOverlayProps } from './MultiWorkspacePlanSelectionOverlay';

export function LazyMultiWorkspacePlanSelectionOverlay(
  props: MultiWorkspacePlanSelectionOverlayProps,
) {
  const MultiWorkspacePlanSelectionOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "multi-workspace-plan-selection-overlay" */ './MultiWorkspacePlanSelectionOverlay'
      ),
    {
      preload: false,
      namedImport: 'MultiWorkspacePlanSelectionOverlay',
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
          <MultiWorkspacePlanSelectionOverlay {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
