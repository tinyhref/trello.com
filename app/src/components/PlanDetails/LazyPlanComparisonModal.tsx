import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { useLazyComponent } from '@trello/use-lazy-component';

import type { PlanComparisonModalProps } from './PlanComparisonModal';

export const LazyPlanComparisonModal: FunctionComponent<
  PlanComparisonModalProps
> = (props) => {
  const PlanComparisonModal = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "plan-comparison-modal" */ './PlanComparisonModal'
      ),
    { namedImport: 'PlanComparisonModal' },
  );

  return (
    <Suspense fallback={null}>
      <PlanComparisonModal {...props} />
    </Suspense>
  );
};
