import type { RefObject } from 'react';
import { useCallback, useEffect, useLayoutEffect } from 'react';

import { useBoardId } from '@trello/id-context';
import { SharedState, useSharedStateSelector } from '@trello/shared-state';

import { getNodeCardId } from 'app/src/components/BoardListView/getListCardsTreeWalker';
import { getNodeListId } from 'app/src/components/BoardListView/getListsTreeWalker';

/** NOTE: Only exported for unit tests, do not rely on this! */
export const seenListAndCardIds = new SharedState(new Set<string>());

/**
 * Manually add a list or card to the list of seen entries in the viewport.
 * Useful for bypassing the viewport check for newly created lists or cards,
 * which would otherwise flicker.
 *
 * Note that this mutates the state instead of setting a new one; this is on
 * purpose, as this should run prior to any new observer subscriptions are added
 * and allow other subscribers to completely ignore the insertion.
 */
export const bypassViewportCheckForListOrCardId = (listOrCardId: string) =>
  seenListAndCardIds.value.add(listOrCardId);

export const useHasListOrCardBeenInViewport = (listOrCardId: string) =>
  useSharedStateSelector(
    seenListAndCardIds,
    useCallback((value) => value.has(listOrCardId), [listOrCardId]),
  );

let viewportObserver: IntersectionObserver;

/**
 * Initializes an IntersectionObserver on the board canvas to detect when lists
 * or cards have entered the viewport, which is used for incremental rendering.
 * This hook should be called once, on the board canvas, as it sets up a single
 * observer to watch for changes across the entire board, and also cleans itself
 * up when the board ID changes.
 *
 * Consume this API with {@link useListsAndCardsViewportObserver}.
 */
export const useSetupListsAndCardsViewportObserver = () => {
  const boardId = useBoardId();

  useLayoutEffect(() => {
    // Clear out the shared state when the board ID changes, to minimize the
    // risk of unbounded memory costs.
    // NOTE: This is a little hard to debug, but we think it's possible that
    // this may be the cause of some niche bugs, so we're setting an arbitrary
    // minimum size of 1,000 before clearing this out. Should be temporary.
    if (seenListAndCardIds.value.size >= 1000) {
      seenListAndCardIds.setValue(new Set<string>());
    }
  }, [boardId]);

  useLayoutEffect(() => {
    viewportObserver = new IntersectionObserver((entries, instance) => {
      const newIds: string[] = [];

      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        instance.unobserve(element);

        const id = getNodeCardId(element) || getNodeListId(element);
        if (!id) {
          console.error('Element entered viewport, but ID could not be found.');
          return;
        }
        newIds.push(id);
      });

      seenListAndCardIds.setValue((value) => {
        newIds.forEach((id) => {
          value.add(id);
        });
        return value;
      });
    });

    return () => {
      viewportObserver?.disconnect();
    };
  }, []);
};

/**
 * Observes a list or card element using a
 * {@link useSetupListsAndCardsViewportObserver shared viewport observer}
 * and returns true if the element has ever entered the viewport.
 *
 * Note: there is some implicit coupling here. Observed elements _must_ have the
 * LIST_ID_ATTRIBUTE or CARD_ID_ATTRIBUTE, as we want to key seen entries by ID,
 * but the observer's callback only includes metadata about the given element.
 */
export const useListsAndCardsViewportObserver = (
  listOrCardId: string,
  ref: RefObject<HTMLElement>,
) => {
  // Must use useEffect here, rather than useLayoutEffect, because card front
  // elements are observed from their parent ListCard elements via forwardRef.
  // useLayoutEffect runs before the CardFront child has had a chance to render.
  useEffect(() => {
    if (seenListAndCardIds.value.has(listOrCardId)) {
      return;
    }

    const element = ref.current;
    if (!element) {
      console.error('Tried to observe element, but the ref hasn‘t loaded.');
      return;
    }

    viewportObserver?.observe(element);
    return () => {
      viewportObserver?.unobserve(element);
    };
  }, [listOrCardId, ref]);

  return useHasListOrCardBeenInViewport(listOrCardId);
};
