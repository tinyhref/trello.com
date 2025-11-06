import type { PreferredComparator, StandardComparator } from '@trello/arrays';
import { buildComparator } from '@trello/arrays';

export interface SortableBoard {
  id: string;
  name: string;
}

interface SortBoardsArgs<T extends SortableBoard> {
  boards: T[];
  myBoardIds?: string[];
  myStarredBoardIds?: string[];
  myRecentBoardIds?: string[];
  searchQuery?: string;
}

export const sortBoards = <T extends SortableBoard>({
  boards: _boards,
  myBoardIds = [],
  myStarredBoardIds = [],
  myRecentBoardIds = [],
  searchQuery = '',
}: SortBoardsArgs<T>): T[] => {
  const boards = [..._boards];

  const boardIds = new Set(myBoardIds);
  const recentBoardIds = new Set(myRecentBoardIds);
  const starredBoardIds = new Set(myStarredBoardIds);

  const preferStarredBoards: PreferredComparator<SortableBoard> = (board) =>
    starredBoardIds.has(board.id);
  const preferRecentBoards: PreferredComparator<SortableBoard> = (board) =>
    recentBoardIds.has(board.id);
  const preferMyBoards: PreferredComparator<SortableBoard> = (board) =>
    boardIds.has(board.id);
  const compareAlphabetically: StandardComparator<SortableBoard> = (a, b) =>
    a.name?.localeCompare(b.name) ?? 0;

  // If the query is empty, still sort in a deterministic way
  if (!searchQuery.trim().length) {
    return boards.sort(
      buildComparator(
        preferStarredBoards,
        preferRecentBoards,
        preferMyBoards,
        compareAlphabetically,
      ),
    );
  }

  const preferExactSearch: PreferredComparator<SortableBoard> = (board) =>
    board.name.trim().toLowerCase() === searchQuery.trim().toLowerCase();
  // Preferred if the name of the board starts with the search term;
  // if both do, prefer the shorter of the two names
  const compareSearchQuery: StandardComparator<SortableBoard> = (
    boardA,
    boardB,
  ) => {
    const [a, b] = [boardA, boardB].map((board) =>
      board.name.toLowerCase().startsWith(searchQuery.toLowerCase()),
    );
    if (a && b) {
      return boardA.name.length - boardB.name.length;
    }
    return Number(b) - Number(a);
  };

  return boards.sort(
    buildComparator(
      preferExactSearch,
      preferStarredBoards,
      preferRecentBoards,
      preferMyBoards,
      compareSearchQuery,
      compareAlphabetically,
    ),
  );
};
