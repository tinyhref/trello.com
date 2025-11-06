import { useContext } from 'react';

import { BoardIdContext } from './BoardIdContext';

/**
 * Returns the current board ID from BoardIdContext.  If useNewId is true, returns the new native graphql board ID.
 * @param useNodeId Should return the new native graphql board ID?; default is false.
 * @returns If true, returns the native graphql board id (boardNodeId), otherwise returns the legacy board id (boardId).
 */
export const useBoardId = (useNodeId: boolean = false) => {
  const boardIdContext = useContext(BoardIdContext);

  if (boardIdContext === null) {
    throw new Error(
      'Could not find board ID in the React context. Did you forget to wrap the root component in a <BoardIdProvider>?',
    );
  }

  const noNodeIdError =
    'Tried to use boardNodeId when it was not provided to the nearest <BoardIdProvider>.  Did you forget to provide the new id to the provider?';

  // If the context is a primitive string, return it as the board ID.
  if (typeof boardIdContext === 'string') {
    // If they wanted the new id, but the context is just a string (the legacy id), throw an error.
    if (useNodeId) {
      throw new Error(noNodeIdError);
    }

    return boardIdContext;
  }

  // If the context is a complex object, return the appropriate version of board ID.
  if (useNodeId) {
    if (!boardIdContext.boardNodeId) {
      throw new Error(noNodeIdError);
    }

    return boardIdContext.boardNodeId;
  } else {
    return boardIdContext.boardId;
  }
};

/**
 * Returns the (new ARI-based native graphql) board ID from BoardIdContext.
 * @returns The current board ID.
 */
export const useNewBoardId = () => useBoardId(true);

/**
 * Returns the (legacy) board ID from BoardIdContext.
 * @returns The current board ID.
 */
export const useLegacyBoardId = () => useBoardId(false);
