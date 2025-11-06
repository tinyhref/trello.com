import type { RefObject } from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * Scroll an element into view, and _keep it in the viewport_ until the user has
 * manually scrolled its parent scroll container element.
 *
 * Here's the problem: until a card has entered the viewport, it's rendered as
 * a minimal card, without any metadata. When the card is hydrated, its height
 * can change. This is a fairly natural-feeling interaction, as we progressively
 * enhance the card front as it's scrolled into view.
 *
 * If the user clicks the "Add a card" button to open the card composer at the
 * bottom of a list, the scroll container should jump to the bottom. If that
 * container has cards that need to be hydrated, those cards will all re-render,
 * expanding the scroll container, and pushing the card composer back down, past
 * the scroll container.
 *
 * This is a tricky problem because we can't know how many cards need to render,
 * how tall the scrollbar might become, or when the progressive rendering has
 * resolved. So here's an attempt at a fix: using a {@link IntersectionObserver}
 * and the {@link onscroll} event, continuously scroll the card composer into
 * view, until a user-initiated scroll event is detected.
 *
 * This is a _very_ opinionated hook, so we're keeping it locally scoped, even
 * though its args are generic. If this behavior is ever needed for a different
 * use case, this hook could potentially live in `@trello/dom-hooks`.
 */
export function usePersistentScrollIntoView(ref: RefObject<HTMLElement>) {
  // Keep track of whether a programmatic scroll event is queued:
  const isProgrammaticallyScrollingRef = useRef(false);
  const enqueueProgrammaticScrollIntoView = useCallback(() => {
    if (isProgrammaticallyScrollingRef.current) {
      return;
    }
    isProgrammaticallyScrollingRef.current = true;
    ref.current?.scrollIntoView({ block: 'nearest' });
    // Release the queue in an animation frame to ensure that the scroll event
    // listener below has a chance to resolve first:
    requestAnimationFrame(() => {
      isProgrammaticallyScrollingRef.current = false;
    });
  }, [ref]);

  const intersectionObserver = useMemo(() => {
    return new IntersectionObserver((entries) => {
      if (!entries[entries.length - 1].isIntersecting) {
        enqueueProgrammaticScrollIntoView();
      }
    });
  }, [enqueueProgrammaticScrollIntoView]);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    intersectionObserver.observe(element);

    function detectManualScrollEvent() {
      if (isProgrammaticallyScrollingRef.current) {
        return;
      }

      intersectionObserver.disconnect();
      document.removeEventListener('scroll', detectManualScrollEvent, true);
    }

    document.addEventListener('scroll', detectManualScrollEvent, true);

    return () => {
      intersectionObserver.disconnect();
      document.removeEventListener('scroll', detectManualScrollEvent, true);
    };
  }, [ref, intersectionObserver]);

  return enqueueProgrammaticScrollIntoView;
}

export const PersistentScrollIntoView = ({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLElement>;
}) => {
  usePersistentScrollIntoView(scrollRef);
  return null;
};
