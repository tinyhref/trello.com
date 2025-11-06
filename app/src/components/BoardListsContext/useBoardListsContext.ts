import { useContextSelector } from 'use-context-selector';

import type { BoardListsContextValue } from './BoardListsContext';
import { BoardListsContext } from './BoardListsContext';

/**
 * Access the BoardListsContext with a context selector to access a specific
 * nested value. This allows consumers to only subscribe to updates on the
 * selected value.
 *
 * @example
 * // Only subscribe to cards associated with the given list ID:
 * const cards = useBoardListsContext(
 *   useCallback(({ listCards }) => listCards?.[listId], [listId]),
 * );
 */
export const useBoardListsContext = <T>(
  selector: (value: BoardListsContextValue) => T,
) => useContextSelector(BoardListsContext, selector);
