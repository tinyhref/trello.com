import type { FunctionComponent, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { Entitlements } from '@trello/entitlements';
import { showFlag } from '@trello/nachos/experimental-flags';
import { defaultRouter_DO_NOT_USE } from '@trello/router/legacy-router';
import { navigate } from '@trello/router/navigate';
import { useSharedState } from '@trello/shared-state';

import { getWorkspaceViewUrl } from 'app/scripts/controller/urls';
import { workspaceViewNavigationState } from 'app/src/components/BoardSwitcher/workspaceViewNavigationState';
import { WorkspaceViewsDocument } from 'app/src/components/BoardSwitcher/WorkspaceViewsQuery.generated';
import type { ViewFilter } from './filters';
import { BoardsFilter } from './filters';
import { toQueryStringWithDecodedFilterParams } from './toQueryStringWithDecodedFilterParams';
import { useUrlParamsProviderWorkspaceQuery } from './UrlParamsProviderWorkspaceQuery.generated';
import { usePrePopulatedBoardsFilter } from './usePrePopulatedBoardsFilter';
import { useFixForBackboneNavigationBug, useUrlParams } from './useUrlParams';
import { ViewFilters } from './ViewFilters';
import type {
  ViewFiltersContextValue,
  ViewFiltersSource,
} from './ViewFiltersContext';
import { ViewFiltersContext } from './ViewFiltersContext';
import { useViewFiltersCreateOrganizationViewMutation } from './ViewFiltersCreateOrganizationViewMutation.generated';

interface UrlParamsProviderProps {
  viewType?: string;
  idOrg?: string;
  children: ReactNode;
}

export const UrlParamsProvider: FunctionComponent<UrlParamsProviderProps> = ({
  viewType,
  idOrg,
  children,
}) => {
  // To repro the bug this fixes: Have a table with 1 board, no filters.
  // Refresh, then try to remove the board. Without this fix, nothing will
  // happen. With this fix, you can remove the board.
  useFixForBackboneNavigationBug();

  const intl = useIntl();
  const urlParams = useUrlParams();

  const viewFiltersFromUrlParams: ViewFilters =
    ViewFilters.fromQueryParams(urlParams);

  const [createOrganizationView, { data, loading, error }] =
    useViewFiltersCreateOrganizationViewMutation();

  useEffect(() => {
    if (data && !loading) {
      if (data.createOrganizationView) {
        navigate(getWorkspaceViewUrl(data.createOrganizationView), {
          trigger: true,
        });
      }
    }
  }, [data, loading]);

  const navigateToUrl = useCallback(
    (newViewFilters: ViewFilters, stripPopulateParam: boolean = false) => {
      const routeContext = defaultRouter_DO_NOT_USE.getRoute();
      const newUrl =
        ViewFilters.constructNewUrl(routeContext)?.(newViewFilters);

      if (
        !newUrl?.searchParams.has('populate') &&
        routeContext.url?.toString() === newUrl?.toString()
      ) {
        return;
      }

      if (stripPopulateParam) {
        // Removes the populate flag and makes sure that the URL gets unencoded.
        newUrl?.searchParams.delete('populate');
        if (newUrl) {
          const queryString = toQueryStringWithDecodedFilterParams(
            newUrl.searchParams,
          );
          newUrl.search = queryString.length ? `?${queryString}` : '';
        }
      }

      navigate(`${newUrl?.pathname}${newUrl?.search}`, { replace: true });
      defaultRouter_DO_NOT_USE.updateSubscribers();
    },
    [],
  );

  const navigateWithUrlParams = useCallback(
    (filter: ViewFilter, stripPopulateParam: boolean = false) => {
      const newViewFilters = viewFiltersFromUrlParams.setFilter(filter);
      navigateToUrl(newViewFilters, stripPopulateParam);
    },
    [viewFiltersFromUrlParams, navigateToUrl],
  );

  const { data: workspaceData, loading: workspaceLoading } =
    useUrlParamsProviderWorkspaceQuery({
      variables: { workspaceId: idOrg ?? '' },
      waitOn: ['MemberHeader'],
    });

  const isFreeTeam = Entitlements.isFree(workspaceData?.organization?.offering);
  const isStandardTeam = Entitlements.isStandard(
    workspaceData?.organization?.offering,
  );

  const hasPopulateParam = useMemo(
    () => urlParams['populate'] !== undefined,
    [urlParams],
  );

  const runPopulate = !isFreeTeam && !isStandardTeam && hasPopulateParam;

  // Logic for pre-populating relevant boards. If the URL Param "populate" is
  // present, we apply some board filters to the params and remove that flag.
  const { loading: relevantBoardsLoading, boards: relevantBoards } =
    usePrePopulatedBoardsFilter(idOrg ?? '', !runPopulate);

  useEffect(() => {
    if (!workspaceLoading && !relevantBoardsLoading && hasPopulateParam) {
      // For workspaces with views, autopopulate boards.
      if (runPopulate && relevantBoards) {
        const boardsFilter = new BoardsFilter(relevantBoards);
        navigateWithUrlParams(boardsFilter, true);
      }
      // For workspaces without views, this strips the populate param.
      else {
        navigateWithUrlParams(viewFiltersFromUrlParams.boards, true);
      }
    }
  }, [
    relevantBoards,
    navigateWithUrlParams,
    runPopulate,
    urlParams,
    relevantBoardsLoading,
    hasPopulateParam,
    viewFiltersFromUrlParams.boards,
    workspaceLoading,
  ]);

  const isLoading = relevantBoardsLoading || hasPopulateParam;

  const clearFilters: ViewFiltersSource['clearFilters'] = useCallback(
    (skip = ['boards', 'sort']) => {
      const emptyFilters = viewFiltersFromUrlParams.clearFilters(skip);
      navigateToUrl(emptyFilters);
    },
    [viewFiltersFromUrlParams, navigateToUrl],
  );

  const getCommonAttributes = useCallback(
    () => ({
      totalFilterLength: viewFiltersFromUrlParams.totalFilterLength([
        'boards',
        'sort',
      ]),
    }),
    [viewFiltersFromUrlParams],
  );

  const [filterPopoverResult, setFilterPopoverResult] =
    useState<ViewFiltersSource['filterPopoverResult']>();

  const taskName =
    viewType === 'Table'
      ? 'create-organizationView/table'
      : 'create-organizationView/calendar';

  const [workspaceViewNavigationFilter] = useSharedState(
    workspaceViewNavigationState,
  );

  const saveFilters = useCallback(
    async (idBoards: Array<string>, viewSource: SourceType) => {
      if (idOrg) {
        const permissionLevel = 'private';
        const name = intl.formatMessage({
          id: 'templates.organization_view.untitled',
          defaultMessage: 'Untitled',
          description: 'The default name for an untitled view',
        });

        const cardFilterData =
          viewFiltersFromUrlParams.toCardFilterCriteria(idBoards);
        const traceId = Analytics.startTask({
          taskName,
          source: viewSource,
        });

        try {
          await createOrganizationView({
            variables: {
              name,
              idOrganization: idOrg,
              prefs: { permissionLevel },
              views: [
                {
                  cardFilter: {
                    criteria: [{ ...cardFilterData }],
                  },
                  defaultViewType: viewType,
                },
              ],
              traceId,
            },
            refetchQueries: [
              {
                query: WorkspaceViewsDocument,
                variables: {
                  orgId: idOrg,
                  organizationViewsFilter:
                    workspaceViewNavigationFilter['filter'],
                },
                context: {
                  operationName: 'WorkspaceViews',
                  document: WorkspaceViewsDocument,
                },
              },
            ],
          });

          Analytics.sendTrackEvent({
            action: 'created',
            actionSubject: 'workspaceView',
            source: viewSource,
            attributes: {
              taskId: traceId,
              location: 'Filters',
              permissionLevel,
              defaultViewType: viewType,
            },
          });

          Analytics.taskSucceeded({
            source: viewSource,
            taskName,
            traceId,
          });
        } catch (err) {
          Analytics.taskFailed({
            source: viewSource,
            error: err,
            taskName,
            traceId,
          });
          showFlag({
            id: 'WorkspaceViewFilters',
            title: intl.formatMessage({
              id: 'templates.organization_view.failed-to-create-view',
              defaultMessage:
                'An error occurred and your Workspace view wasn’t created. Try again in a moment.',
              description:
                'A flag indicating creating the Workspace view errored',
            }),
            appearance: 'error',
            msTimeout: 5000,
          });
        }
      } else if (error) {
        // TODO: Error State.
      }
    },
    [
      taskName,
      idOrg,
      intl,
      viewFiltersFromUrlParams,
      createOrganizationView,
      viewType,
      error,
      workspaceViewNavigationFilter,
    ],
  );

  // @ts-expect-error
  const providerValue: ViewFiltersContextValue<ViewFiltersSource> =
    useMemo(() => {
      return {
        viewFilters: {
          loading: isLoading,
          contextType: 'urlParams',
          filters: viewFiltersFromUrlParams,
          setFilter: navigateWithUrlParams,
          clearFilters,
          resetFilters: clearFilters,
          saveFilters,
          getCommonAttributes,
          filterPopoverResult,
          setFilterPopoverResult,
        },
      };
    }, [
      isLoading,
      viewFiltersFromUrlParams,
      navigateWithUrlParams,
      clearFilters,
      saveFilters,
      getCommonAttributes,
      filterPopoverResult,
      setFilterPopoverResult,
    ]);

  return (
    <ViewFiltersContext.Provider value={providerValue}>
      {children}
    </ViewFiltersContext.Provider>
  );
};
