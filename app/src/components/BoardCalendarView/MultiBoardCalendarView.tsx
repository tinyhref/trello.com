import type { FunctionComponent } from 'react';
import { Suspense, useCallback } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import { ViewsErrorMessage } from 'app/src/components/ViewsErrorMessage';
import { WorkspaceViewCalendarSkeleton } from './WorkspaceViewCalendarSkeleton';

interface MultiBoardCalendarViewProps {
  idOrg: string;
}

export const MultiBoardCalendarView: FunctionComponent<
  MultiBoardCalendarViewProps
> = ({ idOrg }) => {
  const CalendarView = useLazyComponent(
    () => import(/* webpackChunkName: "calendar-view" */ './CalendarView'),
    { namedImport: 'CalendarView' },
  );

  const handleError = useCallback(() => {
    return (
      <ViewsErrorMessage
        screenEventName="multiBoardTableViewErrorScreen"
        analyticsContainers={{ organization: { id: idOrg } }}
      />
    );
  }, [idOrg]);

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-electric',
        feature: 'Calendar View',
      }}
      errorHandlerComponent={handleError}
    >
      <Suspense fallback={<WorkspaceViewCalendarSkeleton />}>
        {/* @ts-expect-error */}
        <ChunkLoadErrorBoundary fallback={handleError}>
          <CalendarView />
        </ChunkLoadErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  );
};
