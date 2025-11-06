import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { ExpiredTrialPlanSelectionProps } from './ExpiredTrialPlanSelection';

export function LazyExpiredTrialPlanSelection(
  props: ExpiredTrialPlanSelectionProps,
) {
  const ExpiredTrialPlanSelection = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "expired-trial-plan-selection" */ './ExpiredTrialPlanSelection'
      ),
    {
      preload: false,
      namedImport: 'ExpiredTrialPlanSelection',
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
          <ExpiredTrialPlanSelection {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
