import { useCallback, useMemo } from 'react';

import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useSharedStateSelector } from '@trello/shared-state';

import { bulkActionSelectedCardsSharedState } from 'app/src/components/BulkAction/bulkActionSelectedCardsSharedState';
import { useIsDragToMergeEnabled } from 'app/src/components/BulkAction/useIsDragToMergeEnabled';
import { cardDragAndDropState } from './cardDragAndDropState';

/* A hook that provides various utility functions for multi-card drag and drop.
 * Optionally takes in the id of the card this hook instance is associated with.
 * Returns an object with the following properties:
 * - selectedCardIds: an array of all the bulk action selected card ids across all boards.
 * - isMultiDragDisabled: true if the multi-card drag and drop feature gate is off or if there are multiple boards with selected cards.
 * - isMultiDrag: true if there are multiple bulk action cards selected and the current card (before any drag action) is selected.
 * - isMultiDragActive: true if there are multiple bulk action cards selected and the card being dragged is selected.
 * - computeSameListMultiDropIndex: a function that computes the drop index for multi-card drag and drop within the same list.
 */
export const useMultiCardDragAndDrop = (cardId?: string) => {
  const { value: isMultiCardDragAndDropEnabled } = useFeatureGate(
    'phx_multi_card_drag_and_drop',
  );

  /* Returns the id of the card currently being dragged. */
  const draggedCardId = useSharedStateSelector(
    cardDragAndDropState,
    useCallback((state) => state.cardId, []),
  );

  /* Returns the number of boards with selected cards. */
  const numBoardsWithSelectedCards = useSharedStateSelector(
    bulkActionSelectedCardsSharedState,
    useCallback((state) => Object.keys(state.selectedCards).length, []),
  );

  /* Returns an array of all the bulk action selected card ids across all boards. */
  const selectedCardIds = useSharedStateSelector(
    bulkActionSelectedCardsSharedState,
    useCallback((state) => {
      return Object.values(state.selectedCards).reduce(
        (cards: string[], boardCardIds) => [
          ...cards,
          ...Object.keys(boardCardIds),
        ],
        [],
      );
    }, []),
  );

  /* Returns a set of all the bulk action selected card ids across all boards. */
  const selectedCardIdsSet = useMemo(
    () => new Set(selectedCardIds),
    [selectedCardIds],
  );

  /* Returns true if the multi-card drag and drop feature gate is off or if there are multiple boards with selected cards. */
  const isMultiDragDisabled = useMemo(
    () => !isMultiCardDragAndDropEnabled || numBoardsWithSelectedCards > 1,
    [isMultiCardDragAndDropEnabled, numBoardsWithSelectedCards],
  );

  /* Returns true if there are multiple bulk action cards selected. */
  const areMultipleCardsSelected = useMemo(() => {
    return selectedCardIds.length > 1;
  }, [selectedCardIds]);

  /* Whether the current card is part of a multi-card drag and drop.
   * Returns true if there are multiple cards selected and the current card (before any drag action) is selected.
   */
  const isMultiDrag = useMemo(
    () =>
      isMultiCardDragAndDropEnabled &&
      areMultipleCardsSelected &&
      selectedCardIdsSet.has(cardId ?? ''),
    [
      isMultiCardDragAndDropEnabled,
      areMultipleCardsSelected,
      selectedCardIdsSet,
      cardId,
    ],
  );

  /* Whether the card being dragged is part of a multi-card drag and drop.
   * Returns true if there are multiple cards selected and the card being dragged is selected.
   */
  const isMultiDragActive = useMemo(
    () =>
      isMultiCardDragAndDropEnabled &&
      areMultipleCardsSelected &&
      selectedCardIdsSet.has(draggedCardId ?? ''),
    [
      isMultiCardDragAndDropEnabled,
      areMultipleCardsSelected,
      selectedCardIdsSet,
      draggedCardId,
    ],
  );

  const isDragToMergeEnabled = useIsDragToMergeEnabled();

  /* Helper function for computing the drop index for multi-card drag and drop within the same list.
   * Takes into account that the target list can have multiple selected cards being moved.
   * Returns the target index in the full list that the selected cards should be dropped at.
   */
  const computeSameListMultiDropIndex = useCallback(
    (cards: Array<{ id: string }>, currentClosestEdge: Edge | null) => {
      // if drag to merge is enabled, we don't need to filter out the selected cards because they are still visible
      const targetListUnselectedCards = isDragToMergeEnabled
        ? cards
        : cards.filter((card) => !selectedCardIdsSet.has(card.id));

      // Find target card index inside the reduced list (target list without selected cards)
      let targetIndexInReducedList = targetListUnselectedCards.findIndex(
        (card) => card.id === cardId,
      );

      // Insert after target card if hovering over the bottom edge
      if (currentClosestEdge === 'bottom') {
        targetIndexInReducedList += 1;
      }

      // Translate reduced list target index to a full list (target list including selected cards) index
      const targetCardId =
        targetListUnselectedCards[targetIndexInReducedList]?.id;
      const targetIndexInFullList = cards.findIndex(
        (card) => card.id === targetCardId,
      );

      // If target card in full list is not found (e.g. all cards in list are selected),
      // return cards.length (drop at end of list).
      // Else, return the full list target index
      return targetIndexInFullList === -1
        ? cards.length
        : targetIndexInFullList;
    },
    [cardId, selectedCardIdsSet, isDragToMergeEnabled],
  );

  return {
    selectedCardIds,
    selectedCardIdsSet,
    isMultiDragDisabled,
    isMultiDrag,
    isMultiDragActive,
    computeSameListMultiDropIndex,
  };
};
