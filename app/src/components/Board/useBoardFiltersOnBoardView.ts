import { useCallback, useEffect } from 'react';

import { getLocation } from '@trello/router';
import { useSharedStateSelector } from '@trello/shared-state';

import { viewFiltersContextSharedState } from 'app/src/components/ViewFilters/viewFiltersContextSharedState';
import { legacyBoardModelsSharedState } from './legacyBoardModelsSharedState';

/**
 * Utility hook to help set various states for legacy board filters.
 */
export const useBoardFiltersOnBoardView = () => {
  const board = useSharedStateSelector(
    legacyBoardModelsSharedState,
    useCallback((state) => state.board.model, []),
  );

  /**
   * Carried over from the legacy board view. This will set the board filter based on the initial
   * query parameters. We should investigate why this is needed since we have
   * app/src/components/BoardListView/useBoardFilterSearchParams.tsx
   */
  useEffect(() => {
    const searchParams = new URLSearchParams(getLocation().search);
    if (searchParams.get('filter')) {
      board?.filter.fromQueryString(searchParams.get('filter'));
    }
  }, [board?.filter]);

  /**
   * Also carried over from legacy board view. This likely isn't needed, and is redundant, but needs
   * more investigation and testing to be sure we can remove.
   */
  useEffect(() => {
    if (!board) {
      return;
    }

    const unsubscribe = viewFiltersContextSharedState.subscribe(() => {
      board.filter.viewFiltersContext = viewFiltersContextSharedState.value;
    });

    return () => {
      unsubscribe();
    };
  }, [board, board?.filter.viewFiltersContext]);
};
