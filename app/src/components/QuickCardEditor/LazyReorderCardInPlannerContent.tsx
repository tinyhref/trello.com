import { Suspense, type FunctionComponent } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

interface Props {
  handleSave: () => void;
  selectedPosition: number;
  positionOptions: Array<{
    label: string;
    value: number;
    meta?: string;
  }>;
  handlePositionChange: (
    option: { label: string; value: number; meta?: string } | null,
  ) => void;
}

export const LazyReorderCardInPlannerContent: FunctionComponent<Props> = (
  props,
) => {
  const ReorderCardInPlannerContent = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "reorder-card-in-planner-content" */ './ReorderCardInPlannerContent'
      ),
    { namedImport: 'ReorderCardInPlannerContent' },
  );

  return (
    <ErrorBoundary>
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <ReorderCardInPlannerContent {...props} />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
