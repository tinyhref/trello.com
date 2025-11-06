import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import { PermissionsContextProvider } from 'app/src/components/BoardDashboardView/PermissionsContext';
import { SingleBoardViewProvider } from 'app/src/components/BoardViewContext/SingleBoardViewProvider';
import { SingleBoardViewFiltersProvider } from 'app/src/components/ViewFilters/SingleBoardViewFiltersProvider';

interface TimelineViewWrapperProps {
  idBoard: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigateToCard: (id: string, params?: any) => void;
}

export const TimelineViewWrapper: FunctionComponent<
  TimelineViewWrapperProps
> = ({ idBoard, navigateToCard }: TimelineViewWrapperProps) => {
  const TimelineView = useLazyComponent(
    () => import(/* webpackChunkName: "timeline-view" */ './TimelineView'),
    { namedImport: 'TimelineView' },
  );
  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Timeline View',
      }}
    >
      <Suspense fallback={null}>
        <ChunkLoadErrorBoundary fallback={null}>
          <PermissionsContextProvider idBoard={idBoard}>
            <SingleBoardViewFiltersProvider idBoard={idBoard}>
              <SingleBoardViewProvider
                idBoard={idBoard}
                navigateToCard={navigateToCard}
                isDateBasedView={true}
              >
                <TimelineView idBoard={idBoard} />
              </SingleBoardViewProvider>
            </SingleBoardViewFiltersProvider>
          </PermissionsContextProvider>
        </ChunkLoadErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  );
};
