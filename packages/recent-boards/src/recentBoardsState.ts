import { getMemberId } from '@trello/authentication';
import { PersistentSharedState } from '@trello/shared-state';

/*
  We store both the board ID _and_ dateLastView. This allows us to
  interweave these locally stored boards with boards fetched from the DB
*/
export interface RecentBoard {
  id: string;
  dateLastView: Date;
}

export const recentBoardsState = new PersistentSharedState<RecentBoard[]>([], {
  storageKey: () => `recentBoardsState-${getMemberId() ?? 'anonymous'}`,
});

export const getRecentBoards = () => {
  return recentBoardsState.value || [];
};

export const pushRecentBoard = (board: RecentBoard) => {
  const MAX_BOARDS_TO_PERSIST = 16;
  const recentBoards = getRecentBoards();
  recentBoardsState.setValue(
    [
      board,
      ...recentBoards.filter((recentBoard) => recentBoard.id !== board.id),
    ].slice(0, MAX_BOARDS_TO_PERSIST),
  );
};

export const removeRecentBoardById = (boardId: string) => {
  recentBoardsState.setValue(
    getRecentBoards().filter((board) => board.id !== boardId),
  );
};
