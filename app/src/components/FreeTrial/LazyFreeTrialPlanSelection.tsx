import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { FreeTrialPlanSelectionProps } from './FreeTrialPlanSelection';

export function LazyFreeTrialPlanSelection(props: FreeTrialPlanSelectionProps) {
  const FreeTrialPlanSelection = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "free-trial-plan-selection" */ './FreeTrialPlanSelection'
      ),
    {
      preload: false,
      namedImport: 'FreeTrialPlanSelection',
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
          <FreeTrialPlanSelection {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
