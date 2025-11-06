import { createContext } from 'use-context-selector';

import type { BoardListsContextQuery } from './BoardListsContextQuery.generated';

type Board = NonNullable<NonNullable<BoardListsContextQuery>['board']>;
export type List = NonNullable<Board['lists']>[number];
export type Card = NonNullable<Board['cards']>[number];
export type ListCard = {
  id: string;
  pos: number;
  cardRole: string | null;
  pinned: boolean;
  dueComplete?: boolean;
};

export interface BoardListsContextValue {
  /**
   * Lists sorted by position.
   * Should be used to get the render order for all lists.
   */
  lists?: Array<{
    id: string;
    pos: number;
    type?: 'datasource' | null;
  }>;
  /**
   * A map of list ID to associated card IDs, sorted by position.
   * Should be used to get the render order for cards within a list.
   */
  listCards?: Record<string, Array<ListCard>>;
}

export const BoardListsContext = createContext<BoardListsContextValue>({});
