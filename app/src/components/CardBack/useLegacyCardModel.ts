import { useEffect, useRef, useState } from 'react';

import { optimisticIdManager } from '@trello/graphql';

import { ModelCache } from 'app/scripts/db/ModelCache';
import type { Card } from 'app/scripts/models/Card';

/**
 * Returns a legacy card model from ModelCache.
 *
 * @param cardId - The ID or optimistic ID for a card.
 * @returns A legacy card model or null.
 */
export const useLegacyCardModel = (cardId: string): Card | null => {
  const [cardModel, setCardModel] = useState<Card | null>(null);

  const lastCardModelIdRef = useRef<string | undefined>(undefined);
  lastCardModelIdRef.current = cardModel?.id;

  useEffect(() => {
    // If the card ID hasn't changed, do nothing:
    if (lastCardModelIdRef.current === cardId) {
      return;
    }
    // Immediately reset the card model if the card ID changes:
    if (lastCardModelIdRef.current) {
      setCardModel(null);
    }
    // If the card ID is optimistic, wait for a real ID:
    if (!cardId || optimisticIdManager.isOptimisticId(cardId)) {
      return;
    }

    ModelCache.waitFor('Card', cardId, (_, card) => {
      setCardModel(card || null);
    });
  }, [cardId]);

  return cardModel;
};
