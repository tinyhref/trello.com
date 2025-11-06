import { SharedState } from '@trello/shared-state';

interface BoardSwitcherSearchSharedState {
  query: string | null;
  searchFieldRef: React.RefObject<HTMLInputElement> | null;
  shouldFocus: boolean;
}

export const defaultBoardSwitcherSearchSharedState: BoardSwitcherSearchSharedState =
  {
    query: null,
    searchFieldRef: null,
    shouldFocus: false,
  };

export const boardSwitcherSearchSharedState = new SharedState(
  defaultBoardSwitcherSearchSharedState,
);
