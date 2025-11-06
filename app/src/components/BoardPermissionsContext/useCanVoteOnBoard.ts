import { useContextSelector } from 'use-context-selector';

import type { BoardPermissionsContextValue } from './BoardPermissionsContext';
import { BoardPermissionsContext } from './BoardPermissionsContext';

const selector = (value: BoardPermissionsContextValue) => value.canVoteOnBoard;

/**
 * Whether the current member can vote on cards in the board.
 */
export const useCanVoteOnBoard = () =>
  useContextSelector(BoardPermissionsContext, selector);
