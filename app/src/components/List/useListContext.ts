import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';

import { useBoardId } from '@trello/id-context';
import { useSharedStateSelector } from '@trello/shared-state';

import { useIsCollapsibleListsEnabled } from 'app/src/components/CollapsedListsState';
import { viewFiltersContextSharedState } from 'app/src/components/ViewFilters/viewFiltersContextSharedState';
import type { ListContextValue } from './ListContext';
import { ListContext } from './ListContext';

export function useListContext<T>(selector: (value: ListContextValue) => T) {
  return useContextSelector(ListContext, selector);
}

export const useShouldRenderListContent = () =>
  useContextSelector(
    ListContext,
    useCallback((value) => value.shouldRenderContent, []),
  );

export const useIsListCollapsed = () => {
  const boardId = useBoardId();
  const isCollapsibleListsEnabled = useIsCollapsibleListsEnabled(boardId);

  const [isFiltering, isAutoCollapseEnabled] = useSharedStateSelector(
    viewFiltersContextSharedState,
    useCallback(
      ({ viewFilters }) => {
        if (!isCollapsibleListsEnabled) {
          return [false, false];
        }
        return [
          viewFilters.filters.isFiltering(),
          viewFilters.filters.autoCollapse.getAutoCollapse(),
        ];
      },
      [isCollapsibleListsEnabled],
    ),
  );

  return useContextSelector(
    ListContext,
    useCallback(
      (value) => {
        const isListCollapsedByEmptyFilter =
          isFiltering &&
          isAutoCollapseEnabled &&
          value.visibleCardIds.length === 0;
        return value.isCollapsed || isListCollapsedByEmptyFilter;
      },
      [isAutoCollapseEnabled, isFiltering],
    ),
  );
};
