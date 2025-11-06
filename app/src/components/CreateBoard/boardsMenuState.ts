import type { PIIString } from '@trello/privacy';
import { getRecentBoards } from '@trello/recent-boards';
import { SharedState } from '@trello/shared-state';

interface BoardsMenuSelectedItem {
  id: string;
  category: string | null;
  url: string | undefined;
}

interface NewBillableGuests {
  confirmed: boolean;
  fullName?: PIIString | null;
  id: string;
  initials: string;
  username: string;
}

interface ReopenBoardPopover {
  idBoard: string;
  newBillableGuests: NewBillableGuests[];
  availableLicenseCount: number | null;
  adminNames: string[];
}

export interface BoardsMenuState {
  idBoardsStarred: string[];
  idRecentBoards: string[];
  isDeletingBoard: {
    [key: string]: boolean;
  };
  loading: boolean;
  pastQueries: {
    query: string;
    limited: boolean;
  }[];
  reopenBoardPopover: ReopenBoardPopover | null;
  searchText: string;
  selectedBoard: BoardsMenuSelectedItem | null;
}

const idRecentBoards = getRecentBoards().map((board) => board.id);
const initialState: BoardsMenuState = {
  idBoardsStarred: [],
  idRecentBoards,
  isDeletingBoard: {},
  loading: false,
  pastQueries: [],
  reopenBoardPopover: null,
  searchText: '',
  selectedBoard: null,
};

// This is defined/exported in this file instead of boards-menu.ts to avoid circular dependencies.
export const boardsMenuState = new SharedState<BoardsMenuState>(initialState);
