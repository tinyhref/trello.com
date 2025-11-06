import { SharedState } from '@trello/shared-state';

/**
 * We want to trap focus within the board menu popovers for accessibility.
 * However, with the popover overflow hidden, we also need to portal the
 * Editor popover menus outside of the container to avoid clipping. This
 * means that the Editor popovers are not able to receive focus because
 * of the focus trapping in the parent Popover.
 *
 * As an escape hatch, focus trapping can be disabled with this state.
 * Use sparingly and only if you know what you are doing. Our goal should be
 * to get usages of this state down to zero over time.
 */
export const isEditingBoardDescriptionState = new SharedState(false);
