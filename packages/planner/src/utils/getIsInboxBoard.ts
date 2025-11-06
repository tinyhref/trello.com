import { cachedPersonalWorkspaceIdsState } from '@trello/personal-workspace';

/**
 * Function that can be called to determine if a board is an inbox board.
 * This duplicates logic in useIsInboxBoard, but as a regular function that
 * can be called outside of react function components, such as drop handlers.
 */
export const getIsInboxBoard = (memberId: string, boardId: string): boolean => {
  const inboxIdsState = cachedPersonalWorkspaceIdsState.value;
  // Get the inbox IDs for the given memberId
  const inboxIds = inboxIdsState[memberId];
  // If no inbox IDs exist for the given memberId, return false
  if (!inboxIds) {
    return false;
  }
  // Check if the boardId matches the idBoard in the inbox IDs
  return inboxIds.idBoard === boardId;
};
