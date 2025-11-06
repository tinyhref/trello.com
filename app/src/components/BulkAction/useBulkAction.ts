import { useCallback } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';
import { useSharedStateSelector } from '@trello/shared-state';

import { bulkActionSelectedCardsSharedState } from './bulkActionSelectedCardsSharedState';

/**
 * A custom hook that returns various utility functions and properties related to the bulk actions feature.
 *
 * @returns An object with the following properties:
 * - isBulkActionEnabled: Whether the bulk action feature gate (phx_bulk_actions) is enabled.
 * - isBulkActionV2Enabled: Whether the bulk action v2 feature gate (phx_bulk_actions_v2) is enabled.
 * - numSelectedCards: The number of cards selected across all boards.
 * - lastSelectedCardId: The id of the last selected card.
 * - numBoardsWithSelectedCards: The number of boards with selected cards.
 *
 */
export const useBulkAction = () => {
  const { value: isBulkActionEnabled } = useFeatureGate('phx_bulk_actions');

  const { value: isBulkActionV2Enabled } = useFeatureGate(
    'phx_bulk_actions_v2',
  );
  const numSelectedCards = useSharedStateSelector(
    bulkActionSelectedCardsSharedState,
    useCallback((state) => {
      return Object.values(state.selectedCards).reduce(
        (count, boardCards) => count + Object.keys(boardCards).length,
        0,
      );
    }, []),
  );

  // Using last selected card to get the target board and list for merge cards
  const lastSelectedCardId = useSharedStateSelector(
    bulkActionSelectedCardsSharedState,
    useCallback((state) => {
      const allCardIds: string[] = [];
      Object.values(state.selectedCards).forEach((boardCards) => {
        allCardIds.push(...Object.keys(boardCards));
      });
      return allCardIds.pop() ?? '';
    }, []),
  );

  const numBoardsWithSelectedCards = useSharedStateSelector(
    bulkActionSelectedCardsSharedState,
    useCallback((state) => Object.keys(state.selectedCards).length, []),
  );

  return {
    isBulkActionEnabled,
    isBulkActionV2Enabled,
    numSelectedCards,
    lastSelectedCardId,
    numBoardsWithSelectedCards,
  };
};
