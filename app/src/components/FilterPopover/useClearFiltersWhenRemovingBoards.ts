import { useContext, useEffect } from 'react';

import { ViewFiltersContext } from 'app/src/components/ViewFilters';
import {
  LabelsFilter,
  ListFilter,
  MembersFilter,
} from 'app/src/components/ViewFilters/filters';
import { ID_NONE, NO_LABELS } from 'app/src/satisfiesFilter';
import { getUniqueLabels } from './FilterCriteriaOptions/getUniqueLabels';
import type { FilterCriteriaSourceBoard } from './FilterCriteriaOptions/types';

/**
 * Remove selected members from filter if their boards were removed.
 * @internal for unit tests
 */
export const useClearMembersFiltersWhenRemovingBoards = (
  boards?: FilterCriteriaSourceBoard[],
) => {
  const { viewFilters } = useContext(ViewFiltersContext);

  useEffect(() => {
    if (!boards) {
      return;
    }

    const validIdMembers = new Set([ID_NONE]);

    for (const board of boards) {
      for (const member of board.members ?? []) {
        validIdMembers.add(member.id);
      }
    }

    const newMembersFilter = new MembersFilter(
      new Set(
        [...viewFilters.filters.members.idMembers].filter((idMember) =>
          validIdMembers.has(idMember),
        ),
      ),
    );

    if (
      newMembersFilter.filterLength() !==
      viewFilters.filters.members.filterLength()
    ) {
      viewFilters.setFilter(newMembersFilter, true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boards]); // We only want this to fire when the selected boards have changed.
};

/**
 * Remove selected labels from filter if their boards are removed.
 * @internal for unit tests
 */
export const useClearLabelsFiltersWhenRemovingBoards = (
  boards?: FilterCriteriaSourceBoard[],
) => {
  const { viewFilters } = useContext(ViewFiltersContext);

  useEffect(() => {
    if (!boards) {
      return;
    }

    const labels = getUniqueLabels(boards);
    const labelsByColorMap = new Map<string | null | undefined, Set<string>>([
      [NO_LABELS, new Set([NO_LABELS])],
    ]);
    labels.forEach((labelItem) => {
      const { color, name } = labelItem;
      if (labelsByColorMap.has(color)) {
        labelsByColorMap.get(color)!.add(name);
      } else {
        labelsByColorMap.set(color, new Set([name]));
      }
    });

    // Copy all filters over unless they don't exist on any of the boards after update.
    let newFilterValue = new LabelsFilter();
    viewFilters.filters.labels.labels.forEach((names, color) => {
      names.forEach((name) => {
        const colorLabels = labelsByColorMap.get(color);
        if (colorLabels?.has(name)) {
          newFilterValue = newFilterValue.enable([color, name]);
        }
      });
    });

    if (!newFilterValue.equals(viewFilters.filters.labels)) {
      viewFilters.setFilter(newFilterValue, true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boards]); // We only want this to fire when the selected boards have changed.
};

/**
 * Remove selected lists from filter if their boards were removed.
 * @internal for unit tests
 */
export const useClearListFiltersWhenRemovingBoards = (
  boards?: FilterCriteriaSourceBoard[],
) => {
  const { viewFilters } = useContext(ViewFiltersContext);

  useEffect(() => {
    if (!boards) {
      return;
    }

    const validIdLists = new Set();
    for (const board of boards) {
      for (const list of board.lists ?? []) {
        validIdLists.add(list.id);
      }
    }

    const missingIdLists = [...viewFilters.filters.list.idLists].filter(
      (idList) => !validIdLists.has(idList),
    );

    if (missingIdLists.length) {
      for (const missingIdList of missingIdLists) {
        viewFilters.filters.list.disable(missingIdList);
      }

      viewFilters.setFilter(
        new ListFilter(viewFilters.filters.list.idLists),
        true,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boards]); // We only want this to fire when the selected boards have changed.
};

/**
 * Remove all filters when all boards are removed
 * @internal for unit tests
 */
export const useClearAllFiltersWhenRemovingLastBoard = (
  boards?: FilterCriteriaSourceBoard[],
  loading?: boolean,
) => {
  const { viewFilters } = useContext(ViewFiltersContext);

  useEffect(
    () => {
      if (
        !loading &&
        (!boards || boards?.length === 0) &&
        // Don't clear the filters just because someone doesn't have access to a board
        viewFilters.filters.boards.isEmpty()
      ) {
        viewFilters.clearFilters([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [boards, loading],
  );
};

export const useClearFiltersWhenRemovingBoards = (
  boards?: FilterCriteriaSourceBoard[],
  loading?: boolean,
) => {
  useClearAllFiltersWhenRemovingLastBoard(boards, loading);
  useClearMembersFiltersWhenRemovingBoards(boards);
  useClearLabelsFiltersWhenRemovingBoards(boards);
  useClearListFiltersWhenRemovingBoards(boards);
};
