import { PersistentSharedState } from '@trello/shared-state';

export const CollapsedListState = {
  /**
   * The default state for a list. Because this is stored in local storage,
   * this is an abstract value; a list without an associated entry will be
   * treated as an expanded list. (This means we may be making assumptions about
   * truthiness, so be careful if refactoring this.)
   */
  Expanded: 0,
  /**
   * A collapsed list is essentially marked as hidden for the user. It will
   * display as a minimized component, notably excluding card data.
   */
  Collapsed: 1,
} as const;
export type CollapsedListStateType =
  (typeof CollapsedListState)[keyof typeof CollapsedListState];

export interface CollapsedListsStateValue {
  [boardId: string]: {
    [listId: string]: CollapsedListStateType;
  };
}

export const collapsedListsState =
  new PersistentSharedState<CollapsedListsStateValue>(
    {},
    { storageKey: 'collapsed-lists' },
  );
