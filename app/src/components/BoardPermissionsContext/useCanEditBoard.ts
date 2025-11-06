import { useContextSelector } from 'use-context-selector';

import type { BoardPermissionsContextValue } from './BoardPermissionsContext';
import { BoardPermissionsContext } from './BoardPermissionsContext';

const selector = (value: BoardPermissionsContextValue) => value.canEditBoard;

/**
 * Whether the current member can edit the board.
 */
export const useCanEditBoard = () =>
  useContextSelector(BoardPermissionsContext, selector);
