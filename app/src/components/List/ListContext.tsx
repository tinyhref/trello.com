import { createContext } from 'use-context-selector';

export interface ListContextValue {
  /**
   * Used as a pseudo-render phase for lists. Lists should not render when they
   * have neither been reached by the incremental idle item renderer nor been
   * revealed in the viewport.
   * @default false
   */
  shouldRenderContent: boolean;
  /** The number of cards in the list, excluding separator cards. */
  numCards: number;
  /** A list of visible (i.e. not filtered) card IDs in the list. */
  visibleCardIds: string[];
  /** Whether the list should be collapsed. */
  isCollapsed?: boolean;
  /** The number of completed cards in the list. */
  numCompletedCards: number;
}

export const emptyListContext: ListContextValue = {
  shouldRenderContent: false,
  numCards: 0,
  visibleCardIds: [],
  isCollapsed: false,
  numCompletedCards: 0,
};

/**
 * Context used to provide access to commonly referenced values within the List
 * component. Uses the `context-selector` because the number of cards can change
 * often; always reference this with the `useListContext` utility method!
 *
 * Note: keep usage contained to other intrinsic List components, as cards are
 * not guaranteed to live within a List component.
 */
export const ListContext = createContext<ListContextValue>(emptyListContext);
