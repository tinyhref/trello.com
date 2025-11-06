import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { PlanSelectionOverlayProps } from './PlanSelectionOverlay';

export function LazyPlanSelectionOverlay(props: PlanSelectionOverlayProps) {
  const PlanSelectionOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "plan-selection-overlay" */ './PlanSelectionOverlay'
      ),
    {
      preload: false,
      namedImport: 'PlanSelectionOverlay',
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
          <PlanSelectionOverlay {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
