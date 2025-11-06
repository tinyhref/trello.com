import { useFocusWithin } from '@react-aria/interactions';
import type { DOMAttributes, MouseEventHandler } from 'react';
import { useCallback } from 'react';

import { activeCardSharedState } from './activeCardSharedState';
import { focusCardFront } from './focusCardFront';

/**
 * Focus management should be disabled on card fronts when a layer is opened
 * over a card front, like a popover.
 * See the {@link https://hello.atlassian.net/wiki/spaces/TRFC/pages/2702969474/RFC+Focus+management+on+the+board+canvas#Layer-management RFC} for more details.
 */
let isFocusManagementDisabled = false;

export const disableFocusManagement = () => {
  isFocusManagementDisabled = true;
};

export const restoreFocusManagement = () => {
  isFocusManagementDisabled = false;
  const activeCardId = activeCardSharedState.value.idActiveCard;
  if (activeCardId) {
    focusCardFront(activeCardId);
  }
};

const isCardActive = (cardId: string) =>
  activeCardSharedState.value.idActiveCard === cardId;

const FOCUS_HIJACK_NODE_BLOCKLIST = ['INPUT', 'SELECT', 'TEXTAREA'];
/** When certain elements are focused, we shouldn't hijack focus on hover. */
const canHijackFocus = (): boolean => {
  const currentFocus = document.activeElement?.nodeName ?? '';
  return !FOCUS_HIJACK_NODE_BLOCKLIST.includes(currentFocus);
};

/**
 * At any given time, one card front can be "active", which means that it's
 * highlighted with a hovered background color, its edit button is rendered,
 * and it becomes the target of keyboard shortcuts that affected card fronts.
 * Historically, cards could become active by either of two interactions: hover
 * and arrow key navigation.
 *
 * However, these modalities completely didn't account for focus state, which
 * led to a fundamentally inaccessible paradigm. Because the focus state would
 * operate independently from the active card state, at any time a _different_
 * element could be focused by the browser while a card was also active. This
 * meant that results from user interactions could seem non-obvious. For example,
 * if Card A is active, but Card B is focused, what happens when you press the
 * Enter key? (Card A, because the Enter keypress was being swallowed by a
 * shortcut handler. (This was bad.))
 *
 * This hook is designed to combine all three modalities - hover, arrow keys,
 * and focus state - into a single deterministic state. Now, an "active" card
 * will always be focused, whether it had become active through hover, an arrow
 * key, or a tab cycle.
 */
export const useSetActiveCardOnHoverOrFocus = (
  cardId: string,
): Pick<
  DOMAttributes<HTMLElement>,
  'onBlur' | 'onFocus' | 'onMouseDown' | 'onMouseLeave' | 'onMouseMove'
> => {
  // Because the CardFront element is a non-focusable div, the focused element
  // will always be nested, so use onFocusWithin instead of onFocus.
  const onFocusWithin = useCallback(() => {
    if (!isCardActive(cardId) && !isFocusManagementDisabled) {
      activeCardSharedState.setValue({ idActiveCard: cardId });
    }
  }, [cardId]);

  const onBlurWithin = useCallback(() => {
    if (isCardActive(cardId) && !isFocusManagementDisabled) {
      activeCardSharedState.setValue({ idActiveCard: null });
    }
  }, [cardId]);

  const {
    focusWithinProps: { onFocus, onBlur },
  } = useFocusWithin({ onFocusWithin, onBlurWithin });

  /**
   * Why are we listening to mousemove? Isn't mouseenter sufficient?
   *
   * 1. Hover your mouse over a card.
   * 2. Hit an arrow key, moving the selected card, but not in a way that
   *    scrolls the page -- so the mouse is still hovering over the original
   *    card front.
   * 3. Move your mouse.
   *
   * If we were only listening to mouseenter, we'd never select the card,
   * because the mouse didn't re-enter it.
   */
  const onMouseMove = useCallback(() => {
    if (
      !isCardActive(cardId) &&
      !isFocusManagementDisabled &&
      canHijackFocus()
    ) {
      // Hijack focus, even if it's anywhere else in the document.
      // This combines hover, focus, and active state to align on a single card.
      focusCardFront(cardId, false);
    }
  }, [cardId]);

  const onMouseLeave = useCallback(() => {
    if (isCardActive(cardId) && !isFocusManagementDisabled) {
      (document.activeElement as HTMLElement)?.blur();
    }
  }, [cardId]);

  /**
   * By default, the mouse down event blurs the element. When the user is trying
   * to open the quick card editor via right-click or control-click, disable it.
   */
  const onMouseDown = useCallback<MouseEventHandler>((event) => {
    if (event.ctrlKey || event.button !== 0) {
      event.preventDefault();
    }
  }, []);

  return {
    onFocus,
    onBlur,
    onMouseMove,
    onMouseLeave,
    onMouseDown,
  };
};
