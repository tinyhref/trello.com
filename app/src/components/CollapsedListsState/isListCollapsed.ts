import { collapsedListsState } from './collapsedListsState';
import { getListBoardId } from './getListBoardId';

export const isListCollapsed = (listId: string): boolean => {
  const boardId = getListBoardId(listId);
  if (!boardId) {
    return false;
  }
  return Boolean(collapsedListsState.value[boardId]?.[listId]);
};
