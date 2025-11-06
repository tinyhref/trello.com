import { useContextSelector } from 'use-context-selector';

import type { BoardPermissionsContextValue } from './BoardPermissionsContext';
import { BoardPermissionsContext } from './BoardPermissionsContext';

const selector = (value: BoardPermissionsContextValue) => value.canCopyBoard;

/**
 * Whether the current member can copy the board.
 */
export const useCanCopyBoard = () =>
  useContextSelector(BoardPermissionsContext, selector);
