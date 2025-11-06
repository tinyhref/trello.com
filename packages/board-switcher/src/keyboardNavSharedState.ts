import { SharedState } from '@trello/shared-state';

import type { BoardSwitcherSection } from './BoardSwitcher.types';

interface KeyboardNavSharedState {
  /**
   * The ID of the active BoardSwitcher element. This could be a board tile or
   * a section header button or some other button/link element.
   * @default null
   */
  activeId: string | null;

  /**
   * The section of the board switcher the active tile is in.
   * @default null
   */
  activeSection: BoardSwitcherSection | null;
}

const defaultKeyboardNavSharedState: KeyboardNavSharedState = {
  activeId: null,
  activeSection: null,
};

/**
 * A board tile is considered "active" when it's hovered over or navigated to
 * via keyboard shortcuts (e.g. arrow keys). Traditionally, it's represented
 * by a slight hover outline.
 *
 * Because of the various ways that a board tile can be marked active, and the
 * different implications that are conferred by activating a board, it's worth
 * pointing out that this name is a misnomer. The "active" state is actually a
 * conglomerate of hover and focus states, and has nothing to do with clicks.
 */
export const keyboardNavSharedState = new SharedState<KeyboardNavSharedState>(
  defaultKeyboardNavSharedState,
);
