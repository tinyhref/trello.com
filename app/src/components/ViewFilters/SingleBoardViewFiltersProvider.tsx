import type { FunctionComponent, PropsWithChildren } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Backbone from '@trello/backbone';
import type { LabelColor } from '@trello/labels';
import { defaultRouter_DO_NOT_USE } from '@trello/router/legacy-router';
import { navigate } from '@trello/router/navigate';
import { useSharedState } from '@trello/shared-state';

import { isShowingBoardViewThatHasCards } from 'app/scripts/controller/getCurrentBoardView';
import { ModelCache } from 'app/scripts/db/ModelCache';
import type { CardFilter } from 'app/scripts/view-models/CardFilter';
import { ID_NONE, NO_LABELS } from 'app/src/satisfiesFilter';
import type { BoardActivityFilterString } from './filters/ActivityFilter';
import { ActivityFilter } from './filters/ActivityFilter';
import type { BoardDueFilterString, ViewFilter } from './filters';
import {
  AutoCollapseListsFilter,
  CompleteFilter,
  DueFilter,
  LabelsFilter,
  MembersFilter,
  ModeFilter,
  SortFilter,
  TitleFilter,
} from './filters';
import { toQueryStringWithDecodedFilterParams } from './toQueryStringWithDecodedFilterParams';
import { useUpdateBoardFiltersFromObjectRemoval } from './useUpdateBoardFiltersFromObjectRemoval';
import { useUrlParams } from './useUrlParams';
import { ViewFilters } from './ViewFilters';
import type {
  ViewFiltersContextValue,
  ViewFiltersSource,
} from './ViewFiltersContext';
import { ViewFiltersContext } from './ViewFiltersContext';
import { viewFiltersContextSharedState } from './viewFiltersContextSharedState';

interface BoardFilterType {
  id?: string;
  idLabels?: string[];
  idMembers?: string[];
  due?: BoardDueFilterString;
  overdue?: boolean;
  dueComplete?: boolean;
  dateLastActivity?: BoardActivityFilterString;
  mode?: string;
  title?: string;
  notDue?: boolean;
  autoCollapse?: boolean;
}

export const updateBoardFilterFromViewsFilter = (
  idBoard: string,
  viewsFilter: ViewFilters,
) => {
  const board = ModelCache.get('Board', idBoard);

  const boardFilter = board?.filter;

  const newFilterArr = Object.entries(viewsFilter.toQueryParams());

  boardFilter?.clear();

  newFilterArr.forEach(([key, value]) => {
    switch (key) {
      case 'idMembers':
        {
          const idMembersArr = value?.split(',');
          idMembersArr?.forEach((member) => {
            boardFilter?.addIdMember(member);
          });
        }
        break;
      case 'labels': {
        const labelsArr = value?.split(',');
        const labelsList = board?.labelList.models;
        const labelsObj: {
          [key: string]: string;
        } = {};

        labelsList?.forEach((label) => {
          const labelColor = label.get('color');
          const labelName = label.get('name');

          const labelString = labelName
            ? `${labelColor}:${labelName}`
            : labelColor;
          const labelID = label.get('id');

          labelsObj[labelString] = labelID;
        });
        labelsArr?.forEach((label) => {
          if (label === 'none') {
            return boardFilter?.addIdLabel(ID_NONE);
          }
          const labelID = labelsObj[label];
          boardFilter?.addIdLabel(labelID);
        });
        break;
      }
      case 'due':
        {
          const [first, second, third] = value?.split(',') || [];
          const isOverdueString =
            second === 'overdue' || (!second && first === 'overdue');
          const isNotDueString =
            third === 'notdue' ||
            (!third && second === 'notdue') ||
            (!second && first === 'notdue');
          const rangeString =
            first !== 'overdue' && first !== 'notdue' ? first : null;

          boardFilter?.set('overdue', isOverdueString);
          boardFilter?.set('notDue', isNotDueString);

          if (rangeString) {
            boardFilter?.set('due', rangeString);
          }
        }
        break;
      case 'dateLastActivity':
        {
          const [rangeString] = value?.split(',') || [];
          if (rangeString) {
            boardFilter?.set('dateLastActivity', rangeString);
          }
        }
        break;
      case 'dueComplete':
        {
          if (value === 'true') {
            boardFilter?.set(key, true);
            break;
          }
          if (value === 'false') {
            boardFilter?.set(key, false);
            break;
          }
        }
        break;
      case 'title':
      case 'autoCollapse':
      case 'mode':
        boardFilter?.set(key, value);
        break;
      default:
        break;
    }
  });
};

export const useInitialUrlFilters = (idBoard: string) => {
  useEffect(() => {
    // First check if we have params in the URL to populate
    const queryParams =
      Object.fromEntries(new URLSearchParams(location.search).entries()) || {};
    const urlFilter = ViewFilters.fromQueryParams(queryParams);
    if (urlFilter.isFiltering()) {
      updateBoardFilterFromViewsFilter(idBoard, urlFilter);
    }
  }, [idBoard]);
};

const boardFilterChangeEvents =
  'change:title change:idLabels change:idMembers change:due change:dateLastActivity change:overdue change:notDue change:dueComplete change:mode change:autoCollapse';
const subscribeToModelCacheFilterChanges = (
  idBoard: string,
  eventHandler: (newBoardFilter: CardFilter) => void,
) => {
  const modelCacheBoardFilters = ModelCache.get('Board', idBoard)?.filter;
  if (modelCacheBoardFilters) {
    Backbone.Events.listenTo(
      modelCacheBoardFilters,
      boardFilterChangeEvents,
      eventHandler,
    );
  }
};

const unsubscribeFromModelCacheFilterChanges = (
  idBoard: string,
  eventHandler: (newBoardFilter: CardFilter) => void,
) => {
  const modelCacheBoardFilters = ModelCache.get('Board', idBoard)?.filter;
  if (modelCacheBoardFilters) {
    Backbone.Events.stopListening(
      modelCacheBoardFilters,
      boardFilterChangeEvents,
      eventHandler,
    );
  }
};

export const parseBoardFilterObject = ({
  idLabels,
  idMembers,
  due,
  overdue,
  dueComplete,
  dateLastActivity,
  mode,
  title,
  notDue,
  autoCollapse,
}: BoardFilterType): ViewFilters => {
  let members = new MembersFilter();

  if (idMembers) {
    idMembers.forEach((member) => {
      members = members.toggle(member);
    });
  }

  let labels = new LabelsFilter();
  if (idLabels) {
    idLabels.forEach((idLabel) => {
      if (idLabel === ID_NONE) {
        labels = labels.toggle([NO_LABELS, NO_LABELS]);
      }

      const label = ModelCache.get('Label', idLabel);

      if (label) {
        const color = label.get('color');
        const name = label.get('name');
        labels = labels.toggle([color as LabelColor, name]);
      }
    });
  }

  let dueFilter = due ? DueFilter.fromBoardString(due) : new DueFilter();

  if (overdue) {
    dueFilter = dueFilter.setOverdue(true);
  }
  if (notDue) {
    dueFilter = dueFilter.setNotDue(true);
  }

  if (dueComplete === true) {
    dueFilter = dueFilter.setCompleteFilter(CompleteFilter.Complete);
  } else if (dueComplete === false) {
    dueFilter = dueFilter.setCompleteFilter(CompleteFilter.Incomplete);
  }

  const activityFilter = dateLastActivity
    ? ActivityFilter.fromBoardString(dateLastActivity)
    : new ActivityFilter();

  const titleFilter = title
    ? new TitleFilter().setTitle(title)
    : new TitleFilter();

  const modeFilter =
    mode === 'and' ? new ModeFilter().setMode('and') : new ModeFilter();

  const autoCollapseFilter = new AutoCollapseListsFilter(autoCollapse);

  return new ViewFilters({
    members,
    labels,
    due: dueFilter,
    title: titleFilter,
    mode: modeFilter,
    dateLastActivity: activityFilter,
    autoCollapse: autoCollapseFilter,
  });
};

export const navigateToUrlFromFilterChange = (viewsFilters: ViewFilters) => {
  const routeContext = defaultRouter_DO_NOT_USE.getRoute();

  if (!routeContext?.url) {
    return;
  }

  const newUrlParams = viewsFilters.toQueryParams();
  const newUrl = new URL(routeContext.url.origin + routeContext.url.pathname);

  for (const [key, value] of Object.entries(newUrlParams)) {
    if (value) {
      newUrl.searchParams.set(key, value);
    }
  }

  if (routeContext.url.toString() === newUrl.toString()) {
    return;
  }

  const queryString = toQueryStringWithDecodedFilterParams(newUrl.searchParams);
  const search = queryString.length ? `?${queryString}` : '';

  navigate(`${newUrl.pathname}${search}`, { replace: true });
  defaultRouter_DO_NOT_USE.updateSubscribers();
};

const useSortFromUrl = function () {
  // Relies on useFixForBackboneNavigationBug() from SingleBoardTableView
  const urlParams = useUrlParams();

  const sortFilter = useMemo(() => {
    const sort = SortFilter.fromUrlParams(urlParams);
    return sort;
  }, [urlParams]);

  return sortFilter;
};

interface SingleBoardViewFiltersProviderProps {
  idBoard: string;
}

export const SingleBoardViewFiltersProvider: FunctionComponent<
  PropsWithChildren<SingleBoardViewFiltersProviderProps>
> = ({ children, idBoard }) => {
  // This is completely broken atm and does nothing
  // TODO: Fix ViewFilters.fromQueryParams()
  // useInitialUrlFilters(idBoard);
  const sortFilter = useSortFromUrl();

  const modelCacheBoard = ModelCache.get('Board', idBoard);
  const modelCacheBoardFilters = modelCacheBoard?.filter;
  const boardFilters: BoardFilterType | undefined =
    modelCacheBoardFilters?.toJSON();
  // This will be the cache key for the useMemo, as `.toJSON()` returns a new object every time
  const boardFilterString = JSON.stringify(boardFilters);
  const parsedViewsFilters: ViewFilters = useMemo(
    () => parseBoardFilterObject(boardFilters ?? {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [boardFilterString],
  );
  const parsedAndSortedViewsFilters: ViewFilters = useMemo(
    () => parsedViewsFilters.setFilter(sortFilter),
    [parsedViewsFilters, sortFilter],
  );

  // eslint-disable-next-line @eslint-react/naming-convention/use-state -- This state is not used, but it is needed to make the render reactive to new board filter changes.
  const [, setBoardFilterChangedTime] = useState(() => new Date());

  const onBoardFilterChange = (newBoardFilter: CardFilter) => {
    // We are just triggering re-render to read the up-to-date data from the ModelCache
    setBoardFilterChangedTime(new Date());
  };

  useEffect(() => {
    subscribeToModelCacheFilterChanges(idBoard, onBoardFilterChange);
    return () =>
      unsubscribeFromModelCacheFilterChanges(idBoard, onBoardFilterChange);
  }, [idBoard]);

  useEffect(() => {
    const hasCards = isShowingBoardViewThatHasCards();
    if (hasCards) {
      navigateToUrlFromFilterChange(parsedAndSortedViewsFilters);
    }
  }, [parsedAndSortedViewsFilters]);

  const setFilter = useCallback(
    (filter: ViewFilter) => {
      if (filter.filterType === 'sort') {
        // For the sort order, the url is the the source of truth, since
        // boards don't have a sort order. For other filters, we use the
        // legacy BoardFilter backbone model as the source of truth
        // https://hello.atlassian.net/wiki/spaces/TRELLOFE/pages/1255292939/Trello+views+architecture#For-single-board-views%3A
        // TODO PANO-1855 Remove legacy filtering code
        navigateToUrlFromFilterChange(
          parsedAndSortedViewsFilters.setFilter(filter),
        );
        return;
      }

      if (!modelCacheBoardFilters || !filter.serializeToBackboneFilter) {
        return;
      }

      const backboneFilterCriteria =
        filter.serializeToBackboneFilter(modelCacheBoard);
      for (const key in backboneFilterCriteria) {
        modelCacheBoardFilters.set(
          key,
          backboneFilterCriteria[key as keyof typeof backboneFilterCriteria],
        );
      }
    },
    [parsedAndSortedViewsFilters, modelCacheBoardFilters, modelCacheBoard],
  );

  useUpdateBoardFiltersFromObjectRemoval(
    idBoard,
    parsedAndSortedViewsFilters,
    setFilter,
  );

  const clearFilters = useCallback(() => {
    modelCacheBoardFilters?.clear();
  }, [modelCacheBoardFilters]);

  const getCommonAttributes = useCallback(
    () => ({
      totalFilterLength: parsedAndSortedViewsFilters.totalFilterLength([
        'boards',
        'sort',
      ]),
    }),
    [parsedAndSortedViewsFilters],
  );

  const [filterPopoverResult, setFilterPopoverResult] =
    useState<ViewFiltersSource['filterPopoverResult']>();

  const providerValue: ViewFiltersContextValue<ViewFiltersSource> = useMemo(
    () => ({
      viewFilters: {
        boardId: idBoard,
        contextType: 'singleBoard',
        filters: parsedAndSortedViewsFilters,
        setFilter,
        clearFilters,
        resetFilters: clearFilters,
        getCommonAttributes,
        filterPopoverResult,
        setFilterPopoverResult,
      },
    }),
    [
      idBoard,
      clearFilters,
      filterPopoverResult,
      getCommonAttributes,
      setFilter,
      parsedAndSortedViewsFilters,
    ],
  );

  const [, setSharedState] = useSharedState(viewFiltersContextSharedState);

  useEffect(() => {
    setSharedState(providerValue);
  }, [providerValue, setSharedState]);

  return (
    <ViewFiltersContext.Provider value={providerValue}>
      {children}
    </ViewFiltersContext.Provider>
  );
};
