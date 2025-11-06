import type { FunctionComponent, ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { showFlag } from '@trello/nachos/experimental-flags';

import type { ViewFilter } from './filters/ViewFilter';
import { useUpdateViewInOrganizationViewMutation } from './UpdateViewInOrganizationViewMutation.generated';
import { useUpdateViewOptionsMutation } from './UpdateViewOptionsMutation.generated';
import type { ViewFiltersParams } from './ViewFilters';
import { ViewFilters } from './ViewFilters';
import type {
  ViewFiltersContextValue,
  ViewFiltersSource,
} from './ViewFiltersContext';
import { ViewFiltersContext } from './ViewFiltersContext';
import { useViewFiltersContextFragment } from './ViewFiltersContextFragment.generated';

interface SavedViewProviderProps {
  workspaceViewId: string;
  idView: string;
  children: ReactNode;
  viewSource: SourceType;
}

export const SavedViewProvider: FunctionComponent<SavedViewProviderProps> = ({
  workspaceViewId,
  idView,
  viewSource,
  children,
}) => {
  const intl = useIntl();
  const [viewFiltersPreview, setViewFiltersPreview] = useState<
    ViewFilters | undefined
  >(undefined);

  const { data: organizationView } = useViewFiltersContextFragment({
    from: {
      id: workspaceViewId,
    },
  });

  // Currently we only support 1 view per organization view, but the schema is set up to allow multiple views
  const view = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    return organizationView?.views.find((view) => view.id === idView);
  }, [organizationView?.views, idView]);

  // Currently we only support 1 criteria, but the schema is set up to allow multiple criteria
  const cardFilterCriteria = useMemo(() => {
    return (
      view?.cardFilter.criteria[0] || {
        // Default empty criteria if there isn't one defined yet
        __typename: 'OrganizationView_View_CardFilter_Criteria' as const,
      }
    );
  }, [view?.cardFilter.criteria]);

  function compareFilters(
    filterSetOne: ViewFilters | undefined,
    filterSetTwo: ViewFilters | undefined,
  ) {
    // If the number of total active filters are different then the two ViewFilters are definitely not the same
    if (
      !filterSetOne ||
      !filterSetTwo ||
      filterSetOne.totalFilterLength() !== filterSetTwo.totalFilterLength()
    ) {
      return false;
    }
    // Compare every field except 'sort' bc the 'sort's don't need to be the same for the ViewFilters to be equivalent
    return (
      isEqual(filterSetOne.boards, filterSetTwo.boards) ||
      isEqual(filterSetOne.due, filterSetTwo.due) ||
      isEqual(filterSetOne.labels, filterSetTwo.labels) ||
      isEqual(filterSetOne.list, filterSetTwo.list) ||
      isEqual(filterSetOne.members, filterSetTwo.members) ||
      isEqual(filterSetOne.mode, filterSetTwo.mode) ||
      isEqual(filterSetOne.title, filterSetTwo.title)
    );
  }

  // There are persistent filters (from the database), and preview filters (from
  // state). If previewFilters is defined, we provide that, but use the boards
  // from the persistent filters.
  const filters = useMemo(() => {
    const savedView = ViewFilters.fromSavedView(cardFilterCriteria);
    if (compareFilters(viewFiltersPreview, savedView)) {
      setViewFiltersPreview(undefined);
      return new ViewFilters(savedView)
        .setFilter(savedView.boards)
        .setFilter(savedView.sort);
    }
    return new ViewFilters(viewFiltersPreview ?? savedView)
      .setFilter(savedView.boards)
      .setFilter(savedView.sort);
  }, [cardFilterCriteria, viewFiltersPreview]);

  const getCommonAttributes = useCallback(
    () => ({
      totalFilterLength: filters.totalFilterLength(['boards', 'sort']),
    }),
    [filters],
  );

  const [filterPopoverResult, setFilterPopoverResult] =
    useState<ViewFiltersSource['filterPopoverResult']>();

  // The mutation for updating the saved view.
  const [updateViewInOrganizationView] =
    useUpdateViewInOrganizationViewMutation();

  const persistNewCardFilterCriteria = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (newCardFilterCriteria: any) => {
      if (!organizationView || !view || !cardFilterCriteria) {
        return;
      }

      const newView = {
        cardFilter: {
          ...view.cardFilter,
          criteria: [
            newCardFilterCriteria, // Overwrite the first criteria in the array
            ...view!.cardFilter.criteria.slice(1),
          ],
        },
        id: idView,
      };
      const traceId = Analytics.startTask({
        taskName: 'edit-organizationView/filters',
        source: viewSource,
      });
      try {
        await updateViewInOrganizationView({
          variables: {
            idOrganizationView: workspaceViewId,
            idView,
            view: newView,
            traceId,
          },
        });
        Analytics.sendTrackEvent({
          action: 'updated',
          actionSubject: 'workspaceView',
          actionSubjectId: 'filter',
          source: viewSource,
          attributes: {
            taskId: traceId,
          },
        });

        Analytics.taskSucceeded({
          taskName: 'edit-organizationView/filters',
          source: viewSource,
          traceId,
        });
        showFlag({
          id: 'WorkspaceViewFilters',
          title: intl.formatMessage({
            id: 'templates.organization_view.saved-exclamation',
            defaultMessage: 'Saved!',
            description: 'A flag indicating the Workspace view was saved',
          }),
          appearance: 'success',
          msTimeout: 5000,
        });
      } catch (err) {
        Analytics.taskFailed({
          taskName: 'edit-organizationView/filters',
          source: viewSource,
          error: err,
          traceId,
        });
        showFlag({
          id: 'WorkspaceViewFilters',
          title: intl.formatMessage({
            id: 'templates.organization_view.failed-to-save-view',
            defaultMessage:
              'An error occurred and your Workspace view wasn’t saved. Try again in a moment.',
            description:
              'A flag indicating saving the Workspace view errored and was not saved',
          }),
          appearance: 'error',
          msTimeout: 5000,
        });
        throw err;
      }
    },
    [
      organizationView,
      view,
      cardFilterCriteria,
      idView,
      viewSource,
      updateViewInOrganizationView,
      workspaceViewId,
      intl,
    ],
  );

  const [updateViewOptionsMutation] = useUpdateViewOptionsMutation();

  const setViewOptions = useCallback(
    //This function is currently only used to set Time Horizon
    //Edit VitalStats events if that ever changes

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (viewOptions: any) => {
      const traceId = Analytics.startTask({
        taskName: 'edit-organizationView/calendar/time-horizon',
        source: viewSource,
      });

      try {
        await updateViewOptionsMutation({
          variables: {
            idOrganizationView: workspaceViewId,
            idView,
            viewOptions,
            traceId,
          },
        });

        Analytics.sendTrackEvent({
          action: 'updated',
          actionSubject: 'workspaceView',
          actionSubjectId: 'timeHorizon',
          source: viewSource,
          attributes: {
            taskId: traceId,
          },
        });

        Analytics.taskSucceeded({
          taskName: 'edit-organizationView/calendar/time-horizon',
          source: viewSource,
          traceId,
        });
      } catch (err) {
        Analytics.taskFailed({
          taskName: 'edit-organizationView/calendar/time-horizon',
          source: viewSource,
          error: err,
          traceId,
        });
      }
    },
    [idView, workspaceViewId, viewSource, updateViewOptionsMutation],
  );

  const viewOptions = useMemo(() => {
    return view?.viewOptions;
  }, [view?.viewOptions]);

  // This is technically `resetNonBoardFilters`, as it doesn't (yet) implement the `skip` API.
  const resetFilters: ViewFiltersSource['resetFilters'] = useCallback(
    (skip: (keyof ViewFiltersParams)[] = ['boards', 'sort']) => {
      setViewFiltersPreview(undefined);
      showFlag({
        id: 'WorkspaceViewFilters',
        title: intl.formatMessage({
          id: 'templates.organization_view.filters-reset',
          defaultMessage: 'Filters reset',
          description: 'A flag indicating the view filters were reset',
        }),
        appearance: 'success',
        msTimeout: 5000,
      });
    },
    [intl],
  );

  const clearFilters: ViewFiltersSource['clearFilters'] = useCallback(
    (skip: (keyof ViewFiltersParams)[] = ['boards', 'sort']) => {
      if (!skip?.length) {
        setViewFiltersPreview(undefined);
      } else {
        const emptyFilters = filters.clearFilters(skip);
        setViewFiltersPreview(emptyFilters);
      }
    },
    [filters],
  );

  const saveFilters = useCallback(async () => {
    let newCardFilterCriteria = { ...cardFilterCriteria };
    (Object.values(filters ?? {}) as ViewFilter[]).forEach((filter) => {
      newCardFilterCriteria = {
        ...newCardFilterCriteria,
        ...filter?.toCardFilterCriteria(),
      };
    });

    if (!isEqual(newCardFilterCriteria, cardFilterCriteria)) {
      await persistNewCardFilterCriteria(newCardFilterCriteria);
      setViewFiltersPreview(undefined);
    }
  }, [cardFilterCriteria, filters, persistNewCardFilterCriteria]);

  const setFilter = useCallback(
    (filter: ViewFilter, fromBoardsRemoved?: boolean) => {
      // These filters do nothing when changed on this context.
      const ignoreFilters = ['title', 'mode'];
      if (ignoreFilters.includes(filter.filterType)) return;

      // These fitlers are auto-saved straight to the server.
      const autoSaveFilters = ['boards', 'sort'];
      if (fromBoardsRemoved || autoSaveFilters.includes(filter.filterType)) {
        return persistNewCardFilterCriteria({
          ...cardFilterCriteria,
          ...filter?.toCardFilterCriteria(),
        });
      }
      // The remaining filters set the preview state to enter the Reset/Save
      // filters flow.
      else {
        const preview = (
          viewFiltersPreview ?? ViewFilters.fromSavedView(cardFilterCriteria)
        ).setFilter(filter);
        setViewFiltersPreview(preview);
      }
    },
    [cardFilterCriteria, persistNewCardFilterCriteria, viewFiltersPreview],
  );

  const providerValue: ViewFiltersContextValue<ViewFiltersSource> =
    useMemo(() => {
      return {
        viewFilters: {
          workspaceViewId,
          viewOptions,
          contextType: 'savedView',
          // If there are no boards selected, we retain the preview filters but
          // don't display the reset/save options.
          isFiltersPreviewActive:
            !!viewFiltersPreview && !filters.boards.isEmpty(),
          filters,
          getCommonAttributes,
          setFilter,
          resetFilters,
          clearFilters,
          setViewOptions,
          saveFilters,
          filterPopoverResult,
          setFilterPopoverResult,
        },
      };
    }, [
      workspaceViewId,
      viewOptions,
      viewFiltersPreview,
      setFilter,
      resetFilters,
      clearFilters,
      setViewOptions,
      saveFilters,
      filters,
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
