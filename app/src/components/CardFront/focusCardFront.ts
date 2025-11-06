import { CARD_ID_ATTRIBUTE } from './CardFront.constants';

const FOCUSABLE_ELEMENT_SELECTORS =
  'a[href]:not([tabindex="-1"]), a[href][tabindex="-1"].layered-link, [tabindex="0"]';

/**
 * The CardFront component wraps all card types (TrelloCard, LinkCard,
 * BoardCard, FullCoverCard), but when we manage focus state, we actually don't
 * want that component to be focusable (as it's a div). Instead, we want to find
 * the first focusable element within each card type (most commonly an anchor
 * tag), and focus that instead. This allows us to meet HTML5 accessibility
 * standards, while also allowing each different component for each card type to
 * manage its own internals.
 *
 * Even though using querySelectors is a bit of an anti-pattern in React,
 * we have to access this flow from a few different origins, including keyboard
 * shortcuts, which are set up on the Lists component rather than on each Card.
 */
export const focusCardFront = (
  cardId: string | null,
  shouldScrollIntoView: boolean = true,
) => {
  if (!cardId) return;

  // eslint-disable-next-line @trello/no-query-selector
  const element = document.querySelector(`[${CARD_ID_ATTRIBUTE}="${cardId}"]`);
  // eslint-disable-next-line @trello/no-query-selector
  const focusableElement = element?.querySelector(FOCUSABLE_ELEMENT_SELECTORS);

  if (!(focusableElement instanceof HTMLElement)) return;

  focusableElement.focus({ preventScroll: true });

  if (shouldScrollIntoView) {
    // scrollIntoView is not implemented in jsdom: https://github.com/jsdom/jsdom/issues/1695
    element?.scrollIntoView?.({
      // TypeScript error, fixed in v5.1: https://github.com/microsoft/TypeScript/issues/47441
      behavior: 'instant' as unknown as ScrollBehavior,
      block: 'nearest',
      inline: 'nearest',
    });
  }
};
