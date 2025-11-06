import { collapsedListsState } from './collapsedListsState';
import { getListBoardId } from './getListBoardId';

export const expandList = (listId: string) => {
  const boardId = getListBoardId(listId);
  if (!boardId) {
    return;
  }
  collapsedListsState.setValue((state) => {
    // Delete the entry altogether instead of setting it to false,
    // since this is an unbounded value in local storage.
    delete state[boardId]?.[listId];
    return state;
  });
};
