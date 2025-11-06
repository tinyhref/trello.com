import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { getBoardIdFromRoute } from '@trello/business-logic-react/board';
import { client } from '@trello/graphql';
import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';
import { FilterIcon } from '@trello/nachos/icons/filter';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';
import { getLocation } from '@trello/router';
import { navigate } from '@trello/router/navigate';

import type {
  ViewFiltersContextValue,
  ViewFiltersSource,
} from 'app/src/components/ViewFilters/ViewFiltersContext';
import { viewFiltersContextSharedState } from 'app/src/components/ViewFilters/viewFiltersContextSharedState';
import { ID_NONE, NO_LABELS } from 'app/src/satisfiesFilter';
import type {
  BoardFilterLabelsQuery,
  BoardFilterLabelsQueryVariables,
} from './BoardFilterLabelsQuery.generated';
import { BoardFilterLabelsDocument } from './BoardFilterLabelsQuery.generated';
import type {
  BoardFilterMembersQuery,
  BoardFilterMembersQueryVariables,
} from './BoardFilterMembersQuery.generated';
import { BoardFilterMembersDocument } from './BoardFilterMembersQuery.generated';

const getUrlSearchParamsFromFilterState = (
  boardId: string,
  viewFilters: ViewFiltersContextValue<ViewFiltersSource>['viewFilters'],
): string => {
  const filters = viewFilters.filters;

  if (filters.isFiltering()) {
    const visibleFilters = [];

    const formatTitle = (inputTitle?: string | null) =>
      inputTitle?.replace(/%/g, '%25') ?? undefined;

    const title = formatTitle(filters.title.title);

    if (title) {
      visibleFilters.push(title);
    }

    const labelsFilter = Array.from(filters.labels.labels.entries());

    if (labelsFilter.length) {
      const data = client.readQuery<
        BoardFilterLabelsQuery,
        BoardFilterLabelsQueryVariables
      >({
        query: BoardFilterLabelsDocument,
        variables: {
          boardId,
        },
      });
      const cachedLabels = data?.board?.labels ?? [];
      const labelNameToLabelMap = new Map<
        string,
        NonNullable<BoardFilterLabelsQuery['board']>['labels'][number]
      >();

      cachedLabels.forEach((label) => {
        // labels can have an empty name or empty color, we should never get empty both
        const labelName = label.name || label.color || '';
        return labelNameToLabelMap.set(labelName, label);
      });

      for (const [color, labelIdsSet] of labelsFilter) {
        if (color === NO_LABELS) {
          visibleFilters.push(`label:${ID_NONE}`);
        } else {
          const labelColor = color || '';
          for (const labelName of Array.from(labelIdsSet.values())) {
            const label = labelNameToLabelMap.get(labelName || labelColor);
            if (label) {
              if (label.name) {
                visibleFilters.push(`label:${encodeURIComponent(label.name)}`);
              } else {
                visibleFilters.push(`label:${label.color}`);
              }
            }
          }
        }
      }
    }

    const membersFilter = Array.from(filters.members.idMembers.entries());

    if (membersFilter.length) {
      const data = client.readQuery<
        BoardFilterMembersQuery,
        BoardFilterMembersQueryVariables
      >({
        query: BoardFilterMembersDocument,
        variables: {
          boardId,
        },
      });
      const cachedMembers = data?.board?.members ?? [];
      const memberIdToMemberMap = new Map<
        string,
        NonNullable<BoardFilterMembersQuery['board']>['members'][number]
      >();

      cachedMembers.forEach((member) =>
        memberIdToMemberMap.set(member.id, member),
      );

      for (const [memberId] of membersFilter) {
        if (memberId === ID_NONE) {
          visibleFilters.push(`member:${ID_NONE}`);
        } else {
          const member = memberIdToMemberMap.get(memberId);
          if (member?.username) {
            visibleFilters.push(
              `member:${encodeURIComponent(
                dangerouslyConvertPrivacyString(member.username),
              )}`,
            );
          }
        }
      }
    }

    const dateLastActivity =
      filters.dateLastActivity.toUrlParams().dateLastActivity;

    if (dateLastActivity) {
      visibleFilters.push(`dateLastActivity:${dateLastActivity}`);
    }

    const due = filters.due.getDueFromRange();
    if (due) {
      visibleFilters.push(`due:${due}`);
    }

    const dueComplete = filters.due.getDueComplete();
    if (typeof dueComplete === 'boolean') {
      visibleFilters.push(`dueComplete:${dueComplete}`);
    }

    const overdue = filters.due.getOverdue();
    if (overdue) {
      visibleFilters.push(`overdue:${overdue}`);
    }

    const notDue = filters.due.getNotDue();
    if (notDue) {
      visibleFilters.push(`notDue:${notDue}`);
    }

    const mode = filters.mode.getMode();
    if (mode === 'and') {
      visibleFilters.push('mode:and');
    }

    const autoCollapse = filters.autoCollapse.getAutoCollapse();
    if (autoCollapse) {
      visibleFilters.push('autoCollapse:true');
    }

    return visibleFilters.join(',');
  } else {
    return '';
  }
};

/**
 * Uses the viewFilters context state to update the search params of the page
 */
const updateUrlParamsWithFilterState = (
  boardId: string,
  viewFilters: ViewFiltersContextValue<ViewFiltersSource>['viewFilters'],
) => {
  // Possible that this hook runs because of a change to viewFilters, but we are
  // on a new board. Wait for them to be equal
  if (getBoardIdFromRoute() !== viewFilters.boardId) {
    return;
  }

  const filterQueryString = getUrlSearchParamsFromFilterState(
    boardId,
    viewFilters,
  );
  const currentQueryParams = new URLSearchParams(getLocation().search);
  const currentFilterParam = currentQueryParams.get('filter') ?? '';

  if (filterQueryString) {
    currentQueryParams.set('filter', filterQueryString);
  } else {
    currentQueryParams.delete('filter');
  }

  // since some components listen for any route changes, we want to avoid unnecessary
  // rerenders throughout the application by updating location
  if (filterQueryString === currentFilterParam) {
    return;
  }

  // we don't want the search to always trigger a navigate if the filters match
  // so we append after the early return
  const search = currentQueryParams.toString()
    ? `?${decodeURIComponent(currentQueryParams.toString())}`
    : '';

  navigate(getLocation().pathname + search, { replace: true });
};

/**
 * Listens to filter state and updates url search params appropriately.
 * @param boardId the id of the current board
 */
export const useBoardFilterSearchParams = (boardId: string) => {
  useEffect(() => {
    const unsubscribeFromSharedState = viewFiltersContextSharedState.subscribe(
      ({ viewFilters }) => {
        updateUrlParamsWithFilterState(boardId, viewFilters);
      },
    );

    if (
      getBoardIdFromRoute() !==
      viewFiltersContextSharedState.value.viewFilters.boardId
    ) {
      return;
    }

    // Initialization. This can occur if local storage has saved the filter state but url
    // does not contain the correct query string yet.
    updateUrlParamsWithFilterState(
      boardId,
      viewFiltersContextSharedState.value.viewFilters,
    );

    const viewFilters = viewFiltersContextSharedState.value.viewFilters;
    const isFiltering = viewFilters.filters.isFiltering();

    if (isFiltering) {
      showFlag({
        appearance: 'warning',
        title: (
          <FormattedMessage
            id="filter popover button.filter flag title"
            defaultMessage="This board currently has filters applied."
            description="Filter flag title"
          />
        ),
        id: 'staleFilterPopoverButton',
        icon: <FilterIcon />,
        isAutoDismiss: true,
        actions: [
          {
            content: (
              <FormattedMessage
                id="filter popover button.filter flag button"
                defaultMessage="Clear filters"
                description="Filter flag button"
              />
            ),
            onClick: () => {
              dismissFlag({ id: 'staleFilterPopoverButton' });
              viewFilters.clearFilters();
            },
            type: 'link',
          },
        ],
      });
    }

    return () => {
      unsubscribeFromSharedState();
    };
  }, [boardId]);
};
