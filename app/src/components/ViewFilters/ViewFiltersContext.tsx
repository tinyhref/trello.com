import { createContext } from 'react';

import type { SourceType } from '@trello/analytics-types';
import type { UsePopoverResult } from '@trello/nachos/popover';

import type { ViewFilter } from './filters/ViewFilter';
import type { UpdateViewOptionsMutationVariables } from './UpdateViewOptionsMutation.generated';
import type { ViewFiltersParams } from './ViewFilters';
import { ViewFilters } from './ViewFilters';
import type { ViewFiltersContextFragment } from './ViewFiltersContextFragment.generated';

type ViewOptions =
  NonNullable<ViewFiltersContextFragment>['views'][number]['viewOptions'];

type InputViewOptions = UpdateViewOptionsMutationVariables['viewOptions'];

export interface ViewFiltersSourceBase {
  contextType?: 'defaultView' | 'savedView' | 'singleBoard' | 'urlParams';
  filters: ViewFilters;
  viewOptions?: ViewOptions;
  getCommonAttributes?: () => { totalFilterLength?: number };
}

export interface ViewFiltersSource extends ViewFiltersSourceBase {
  workspaceViewId?: string;
  boardId?: string;
  isFiltersPreviewActive?: boolean;

  /**
   * An optional state to let consumers know if a query on the provider (such as
   * quering relevant boards) is currently loading.
   */
  loading?: boolean;

  setViewOptions?: (viewOptions: InputViewOptions) => void;

  /**
   * Sets a filter value on the context. For SavedViewProviders, this sets a
   * temporary state, which can be saved permanently by subsequently calling
   * `saveFilters`.
   *
   * @param fromBoardsRemoved An optional param that flags that this change is
   * coming from `useClearFiltersWhenRemovingBoards`.
   */
  setFilter: (filter: ViewFilter, fromBoardsRemoved?: boolean) => void;

  /**
   * Holds a reference to the value returned from `usePopover` the filter
   * popover button component. Useful so that any consumers of the context can
   * easily manage the popover state.
   */
  filterPopoverResult?: UsePopoverResult<HTMLButtonElement, HTMLElement> | null;

  /**
   * Should only be called in the component which calls `usePopover` to create
   * the filtering popover.
   */
  setFilterPopoverResult?: (
    popoverResult: UsePopoverResult<HTMLButtonElement, HTMLElement> | null,
  ) => void;

  /**
   * Will save viewFiltersPreview to the consumers source of truth.
   *
   * e.g, URL parameters | server
   *
   * @param idBoards Used to identify boards selected in url param views
   * by id, instead of shortlink.
   *
   * @param viewSource The view source in which the saveFilter's call
   * originates from. Used for analytics.
   */
  saveFilters?: (idBoards?: Array<string>, viewSource?: SourceType) => void;

  /**
   * Reset filters concurrently. For views that support filter previews,
   * this will remove the filter preview so that you only see the
   * most-recently-saved filter set. For views that don't support filter
   * previews, this is equivalent to clearFilters and will clear the
   * saved filters.
   *
   * @param skip Don't clear the filter types specified in the list.
   */
  resetFilters: (skip?: (keyof ViewFiltersParams)[]) => void;

  /**
   * Clear filters concurrently. For views that support filter previews,
   * this will set the filter preview to a cleared copy of the saved
   * filters. For views that don't support filter previews, this is
   * equivalent to resetFilters and will clear the saved filters
   *
   * @param skip Don't clear the filter types specified in the list.
   */
  clearFilters: (skip?: (keyof ViewFiltersParams)[]) => void;
}
export interface ViewFiltersContextValue<T extends ViewFiltersSourceBase> {
  viewFilters: T;
}

export const ViewFiltersContext = createContext<
  ViewFiltersContextValue<ViewFiltersSource>
>({
  viewFilters: {
    filters: new ViewFilters(),
    setFilter() {
      throw new Error('setFilter not implemented');
    },
    resetFilters() {
      throw new Error('resetFilters not implemented');
    },
    clearFilters() {
      throw new Error('clearFilters not implemented');
    },
  },
});
