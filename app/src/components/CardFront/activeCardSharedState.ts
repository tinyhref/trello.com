import { SharedState } from '@trello/shared-state';

interface ActiveCardSharedState {
  idActiveCard: string | null;
}

/**
 * A card is considered "active" when it's hovered over, navigated to via
 * keyboard shortcuts (e.g. arrow keys), or just created. Traditionally, it's
 * represented by a slight hover coloration, and a pencil icon.
 *
 * The active card receives all keyboard shortcuts from the board level, so this
 * state is shared across the entire board, with reads and writes in various
 * places.
 *
 * Because of the various ways that a card can be marked active, and the
 * different implications that are conferred by activating a card, it's worth
 * pointing out that this name is a misnomer. The "active" state is actually a
 * conglomerate of hover and focus states, and has nothing to do with clicks.
 */
export const activeCardSharedState = new SharedState<ActiveCardSharedState>({
  /**
   * The ID of the active card.
   * @default null
   */
  idActiveCard: null,
});
