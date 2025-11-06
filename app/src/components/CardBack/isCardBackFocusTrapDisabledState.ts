import { SharedState } from '@trello/shared-state';

/**
 * We want to trap focus within the card back dialog for accessibility.
 * However, focus trapping breaks some (mostly legacy) scenarios; for example,
 * legacy PopOvers are not contained by their own focus scope, so they cannot
 * receive focus while the user's focus is trapped within the card back.
 *
 * As an escape hatch, focus trapping can be disabled with this state.
 * Use sparingly and only if you know what you are doing. Our goal should be
 * to get usages of this state down to zero over time.
 */
export const isCardBackFocusTrapDisabledState = new SharedState(false);
