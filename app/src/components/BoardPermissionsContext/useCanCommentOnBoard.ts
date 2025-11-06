import { useContextSelector } from 'use-context-selector';

import type { BoardPermissionsContextValue } from './BoardPermissionsContext';
import { BoardPermissionsContext } from './BoardPermissionsContext';

const selector = (value: BoardPermissionsContextValue) =>
  value.canCommentOnBoard;

/**
 * Whether the current member can comment on the board.
 */
export const useCanCommentOnBoard = () =>
  useContextSelector(BoardPermissionsContext, selector);
