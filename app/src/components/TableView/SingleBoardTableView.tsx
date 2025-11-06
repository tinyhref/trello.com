import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import { PermissionsContextProvider } from 'app/src/components/BoardDashboardView/PermissionsContext';
import { SingleBoardViewProvider } from 'app/src/components/BoardViewContext/SingleBoardViewProvider';
import { SingleBoardViewFiltersProvider } from 'app/src/components/ViewFilters/SingleBoardViewFiltersProvider';
import { useFixForBackboneNavigationBug } from 'app/src/components/ViewFilters/useUrlParams';

import * as styles from './SingleBoardTableView.module.less';

interface SingleBoardTableViewProps {
  idBoard: string;
  navigateToCard: (id: string) => void;
}

export const SingleBoardTableView: FunctionComponent<
  SingleBoardTableViewProps
> = ({ idBoard, navigateToCard }: SingleBoardTableViewProps) => {
  const BoardTableView = useLazyComponent(
    () => import(/* webpackChunkName: "table-view" */ './TableView'),
    { namedImport: 'TableView' },
  );

  // To repro the bug this fixes: Load a single board table view. Make sure
  // no filters are set, then sort by due date. Refresh the page. After it
  // loads, try to disable the due date sorting. Without this fix, nothing
  // will happen. With this fix, you can disable the sort.
  useFixForBackboneNavigationBug();

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Table View',
      }}
    >
      <Suspense fallback={null}>
        <PermissionsContextProvider idBoard={idBoard}>
          <SingleBoardViewFiltersProvider idBoard={idBoard}>
            <SingleBoardViewProvider
              idBoard={idBoard}
              navigateToCard={navigateToCard}
            >
              <div className={styles.sbtvWrapper}>
                <BoardTableView />
              </div>
            </SingleBoardViewProvider>
          </SingleBoardViewFiltersProvider>
        </PermissionsContextProvider>
      </Suspense>
    </ErrorBoundary>
  );
};
