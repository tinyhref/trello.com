import type { FunctionComponent, PropsWithChildren } from 'react';
import { useCallback, useContext, useMemo } from 'react';

import type { BoardViewContextValue } from 'app/src/components/BoardViewContext';
import {
  BoardViewContext,
  boardViewContextEmptyValue,
} from 'app/src/components/BoardViewContext';
import { ViewFiltersContext } from 'app/src/components/ViewFilters';
import { SingleBoardViewFiltersProvider } from 'app/src/components/ViewFilters/SingleBoardViewFiltersProvider';
import { noop } from 'app/src/noop';
import { FilterPopoverButton } from './FilterPopoverButton';
import { useSingleBoardViewFilterPopoverContextFragment } from './SingleBoardViewFilterPopoverContextFragment.generated';
import { useVisibleCardsSharedStateSetter } from './useVisibleCardsSharedStateSetter';

/**
 * The filter popover requires BoardViewContext to be defined, but it doesn't
 * need the vast majority of the data fetched for the rest of the views, like
 * data on cards, checklists, custom fields, etc. On single board views, the
 * filter popover only needs data on different filter criteria options, namely
 * the members and labels on a board. All other data is unused, making the query
 * wasteful, especially on the default lists view, which doesn't use this
 * context otherwise.
 *
 * This component wraps its children with a BoardViewContext value that contains
 * only what is necessary for the filter popover to render on the single board
 * view, marking unused values as null.
 */
const SingleBoardViewFilterPopoverContextProvider: FunctionComponent<
  PropsWithChildren<{ idBoard: string }>
> = ({ idBoard, children }) => {
  const { data } = useSingleBoardViewFilterPopoverContextFragment({
    from: { id: idBoard },
  });

  const contextValue = useMemo<BoardViewContextValue>(() => {
    const result: BoardViewContextValue = {
      ...boardViewContextEmptyValue(),
      boardsData: {
        boardsDataContextType: 'board',
        isLoading: !data,
        error: undefined,
        dangerous_refetch: noop,
      },
      contextType: 'board',
      idBoard: data?.id,
      idOrg: data?.idOrganization ?? undefined,
    };

    if (data) {
      const board = {
        ...data,
        boardPlugins: [],
        customFields: [],
        lists: [],
        memberships: [],
        myPrefs: { __typename: 'MyPrefs', calendarKey: '' },
      };
      result.boardsData.boards = [board];
    }

    return result;
  }, [data]);

  return (
    <BoardViewContext.Provider value={contextValue}>
      {children}
    </BoardViewContext.Provider>
  );
};

const FilterPopoverButtonWrapper: FunctionComponent<
  SingleBoardFilterPopoverButtonProps
> = ({ idBoard, ...rest }) => {
  const { viewFilters } = useContext(ViewFiltersContext);
  const isFiltering = useCallback(() => {
    return (
      (viewFilters.contextType === 'singleBoard' &&
        viewFilters.filters.isFiltering()) ??
      false
    );
  }, [viewFilters.contextType, viewFilters.filters]);

  const { cardIds, loading } = useVisibleCardsSharedStateSetter(idBoard);

  return (
    <FilterPopoverButton
      {...rest}
      isFiltering={isFiltering}
      filteredCardsCount={cardIds.size}
      boardId={idBoard}
      isLoading={loading}
    />
  );
};

interface SingleBoardFilterPopoverButtonProps {
  idBoard: string;
  appearance?: 'default' | 'transparent-dark' | 'transparent';
  isDisabled?: boolean;
  isCollapsed?: boolean;
}

/**
 * Wrapper component for the filter popover button on single board views.
 * Multi-board views are entirely wrapped in both a ViewFiltersContext and a
 * BoardViewContext. The filter popover component was originally written for
 * these multi-board views, and so also relies on these contexts.
 */
export const SingleBoardFilterPopoverButton: FunctionComponent<
  SingleBoardFilterPopoverButtonProps
> = ({ idBoard, ...rest }) => {
  return (
    <SingleBoardViewFiltersProvider idBoard={idBoard}>
      <SingleBoardViewFilterPopoverContextProvider idBoard={idBoard}>
        <FilterPopoverButtonWrapper idBoard={idBoard} {...rest} />
      </SingleBoardViewFilterPopoverContextProvider>
    </SingleBoardViewFiltersProvider>
  );
};
