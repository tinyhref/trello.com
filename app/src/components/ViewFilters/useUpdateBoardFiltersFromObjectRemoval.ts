import { useEffect } from 'react';

import { ID_NONE, NO_LABELS } from 'app/src/satisfiesFilter';
import type { ViewFilter } from './filters';
import { useUpdateBoardFiltersFromObjectRemovalQuery } from './UpdateBoardFiltersFromObjectRemovalQuery.generated';
import type { ViewFilters } from './ViewFilters';

/**
 * If a label or member filter exists and that label or member is removed from
 * the board, disables the filter.
 */
export const useUpdateBoardFiltersFromObjectRemoval = (
  idBoard: string,
  filters: ViewFilters,
  setFilter: (viewFilter: ViewFilter) => void,
) => {
  const { data } = useUpdateBoardFiltersFromObjectRemovalQuery({
    variables: { idBoard },
    waitOn: ['CurrentBoardInfo'],
  });

  const labels = data?.board?.labels;
  const members = data?.board?.members.map((member) => member.id);

  useEffect(() => {
    if (!labels) return;

    let newLabelsFilter = filters.labels;
    filters.labels.labels.forEach((colorNames, color) => {
      colorNames.forEach((name) => {
        if (
          color !== NO_LABELS &&
          !labels.find(
            (boardLabel) =>
              boardLabel.name === name && boardLabel.color === color,
          )
        ) {
          newLabelsFilter = newLabelsFilter.disable([color, name]);
        }
      });
    });
    // Not checking deep equality here because newLabelsFilter will be the
    // original filter object if nothing was changed.
    if (filters.labels !== newLabelsFilter) {
      setFilter(newLabelsFilter);
    }
  }, [filters.labels, filters.labels.labels, labels, setFilter]);

  useEffect(() => {
    if (!members) return;

    let newMembersFilter = filters.members;
    filters.members.idMembers.forEach((idMember) => {
      if (idMember !== ID_NONE && !members.includes(idMember)) {
        newMembersFilter = newMembersFilter.disable(idMember);
      }
    });
    // Same as above re: deep equality.
    if (filters.members !== newMembersFilter) {
      setFilter(newMembersFilter);
    }
  }, [filters.members, filters.members.idMembers, members, setFilter]);
};
