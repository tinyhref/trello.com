import { SharedState } from '@trello/shared-state';

/**
 * A user can temporarily "peek" into a collapsed list when a card is dragged
 * over it, in order to re-enable precise drag-and-drop interactions. During the
 * operation, the list should render as a regular expanded list, but after the
 * operation has resolved (e.g. by dropping the card into the list or by
 * dragging the card out of the list and into another one), it should
 * automatically re-collapse.
 *
 * This can be thought of as an override to the normal collapsed state, though
 * it's one-way (can only expand a collapsed list) and in-memory.
 *
 * Store this in a separate state from {@link collapsedListsState}, as this is a
 * transient state; we don't want it to persist at all.
 */
export const peekedCollapsedListIdState = new SharedState<string | null>(null);

/**
 * Peek into a collapsed list, expanding it temporarily.
 */
export const peekCollapsedList = (listId: string) =>
  peekedCollapsedListIdState.setValue(listId);

/**
 * Clear the currently peeked collapsed list (re-collapsing it).
 */
export const clearPeekedCollapsedList = () =>
  peekedCollapsedListIdState.setValue(null);
