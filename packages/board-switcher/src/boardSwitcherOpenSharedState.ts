import { SharedState } from '@trello/shared-state';

interface BoardSwitcherOpenSharedState {
  isOpen: boolean;
  isSpotlightOpen: boolean;
}

export const defaultBoardSwitcherOpenSharedState: BoardSwitcherOpenSharedState =
  {
    isOpen: false,
    isSpotlightOpen: false,
  };

export const boardSwitcherOpenSharedState =
  new SharedState<BoardSwitcherOpenSharedState>(
    defaultBoardSwitcherOpenSharedState,
  );
