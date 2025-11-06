import { collapsedListsState, CollapsedListState } from './collapsedListsState';
import { getListBoardId } from './getListBoardId';

export const collapseList = (listId: string) => {
  const boardId = getListBoardId(listId);
  if (!boardId) {
    return;
  }
  collapsedListsState.setValue((state) => {
    state[boardId] = state[boardId] || {};
    state[boardId][listId] = CollapsedListState.Collapsed;
    return state;
  });
};
