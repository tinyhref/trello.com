import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import { SingleBoardViewProvider } from 'app/src/components/BoardViewContext/SingleBoardViewProvider';
import { SingleBoardViewFiltersProvider } from 'app/src/components/ViewFilters/SingleBoardViewFiltersProvider';
import { useCalendarDefaultZoom } from './useCalendarDeepLinking';

import * as styles from './SingleBoardCalendarView.module.less';

interface SingleBoardCalendarViewProps {
  idBoard: string;
  navigateToCard: (id: string) => void;
  showCloseButton?: boolean;
}

export const SingleBoardCalendarView: FunctionComponent<
  SingleBoardCalendarViewProps
> = ({
  idBoard,
  navigateToCard,
  showCloseButton,
}: SingleBoardCalendarViewProps) => {
  const CalendarView = useLazyComponent(
    () => import(/* webpackChunkName: "calendar-view" */ './CalendarView'),
    { namedImport: 'CalendarView' },
  );

  const calendarDefaultZoom = useCalendarDefaultZoom();
  const defaultZoom = calendarDefaultZoom();

  return (
    <div className={styles.container}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-electric',
          feature: 'Calendar View',
        }}
      >
        <Suspense fallback={null}>
          <ChunkLoadErrorBoundary fallback={null}>
            <SingleBoardViewFiltersProvider idBoard={idBoard}>
              <SingleBoardViewProvider
                idBoard={idBoard}
                isDateBasedView={true}
                navigateToCard={navigateToCard}
                includeChecklistItems={true}
                showCloseButton={showCloseButton}
                defaultZoom={defaultZoom}
              >
                <CalendarView />
              </SingleBoardViewProvider>
            </SingleBoardViewFiltersProvider>
          </ChunkLoadErrorBoundary>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
