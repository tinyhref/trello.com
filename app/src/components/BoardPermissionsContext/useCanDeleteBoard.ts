import { useContextSelector } from 'use-context-selector';

import type { BoardPermissionsContextValue } from './BoardPermissionsContext';
import { BoardPermissionsContext } from './BoardPermissionsContext';

const selector = (value: BoardPermissionsContextValue) => value.canDeleteBoard;

/**
 * Whether the current member can delete board.
 */
export const useCanDeleteBoard = () =>
  useContextSelector(BoardPermissionsContext, selector);
