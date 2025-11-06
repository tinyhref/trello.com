import type FullCalendar from '@fullcalendar/react';
import { type FunctionComponent, type RefObject } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { UFOGateProvider, UFOSuspense } from '@trello/ufo';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyPlanner: FunctionComponent<{
  screenManagerRef: RefObject<HTMLDivElement>;
  plannerRef: RefObject<FullCalendar>;
}> = ({ screenManagerRef, plannerRef }) => {
  const PlannerWrapper = useLazyComponent(
    () => import(/* webpackChunkName: "planner-wrapper" */ './PlannerWrapper'),
    { namedImport: 'PlannerWrapper' },
  );

  return (
    <ErrorBoundary>
      <ChunkLoadErrorBoundary fallback={null}>
        <UFOGateProvider featureGate="tplat_ufo_integration_planner_component">
          <UFOSuspense name="planner-view" fallback={null}>
            <PlannerWrapper
              screenManagerRef={screenManagerRef}
              plannerRef={plannerRef}
            />
          </UFOSuspense>
        </UFOGateProvider>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
