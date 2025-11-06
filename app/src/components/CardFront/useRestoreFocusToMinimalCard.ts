import { useEffect, useRef } from 'react';

import { getHighestVisibleElevation } from '@trello/layer-manager';

import { activeCardSharedState } from './activeCardSharedState';
import { focusCardFront } from './focusCardFront';

/**
 * Restores focus to a minimal card that becomes hydrated when made active.
 * This kicks in when you use tab or arrow keys to focus on a minimal card
 * that's not currently visible in the viewport; after the minimal card
 * rerenders into a full card front, refocus it.
 */
export const useRestoreFocusToMinimalCard = ({
  cardId,
  isMinimal,
}: {
  cardId: string;
  isMinimal: boolean;
}) => {
  // Limit logic to when a card was previously minimal, then hydrated.
  const wasMinimalRef = useRef(isMinimal);
  useEffect(() => {
    if (!wasMinimalRef.current || isMinimal) return;
    // Expectation: cards never become minimal again after they are hydrated.
    // This is a one-way setter to prevent this hook from re-running.
    wasMinimalRef.current = false;

    // Important: don't subscribe to this shared state, or else we'll cause
    // rerenders on every card front component every time the state updates.
    const { idActiveCard } = activeCardSharedState.value;
    if (!idActiveCard || cardId !== idActiveCard) return;
    // Don't automatically restore focus if a layered element is visible.
    // This can happen if a card is moved indirectly while the card back is
    // open (e.g. by another member, or via automation).
    if (getHighestVisibleElevation() > 0) return;
    // See: https://blog.maisie.ink/react-ref-autofocus/
    requestAnimationFrame(() => focusCardFront(cardId));
  }, [cardId, isMinimal]);
};
