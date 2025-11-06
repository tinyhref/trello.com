import { useContextSelector } from 'use-context-selector';

import type { BoardPermissionsContextValue } from './BoardPermissionsContext';
import { BoardPermissionsContext } from './BoardPermissionsContext';

const selector = (value: BoardPermissionsContextValue) => value.canRenameBoard;

/**
 * Whether the current member can rename the board.
 *
 * Renaming the board is a distinct permission from editing the board, as it
 * requires the member to be a board admin (among other details).
 */
export const useCanRenameBoard = () =>
  useContextSelector(BoardPermissionsContext, selector);
