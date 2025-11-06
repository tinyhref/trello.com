import { useCallback } from 'react';
import type { MouseEventHandler } from 'react';

import { smartScheduledCardsSharedState } from '@trello/business-logic/planner';
import { useBoardId } from '@trello/id-context';
import { useSharedStateSelector } from '@trello/shared-state';

import { useBulkAction } from 'app/src/components/BulkAction';
import { bulkActionSelectedCardsSharedState } from 'app/src/components/BulkAction/bulkActionSelectedCardsSharedState';

interface UseMultiSelectClickHandlerOptions {
  cardId: string;
}

export const useMultiSelectClickHandler = ({
  cardId,
}: UseMultiSelectClickHandlerOptions) => {
  const boardId = useBoardId();
  const { isBulkActionEnabled } = useBulkAction();

  const isSmartScheduleLoading = useSharedStateSelector(
    smartScheduledCardsSharedState,
    useCallback((state) => state.isLoading, []),
  );

  const isBulkActionLoading = useSharedStateSelector(
    bulkActionSelectedCardsSharedState,
    useCallback((state) => state.isLoading, []),
  );

  return useCallback<MouseEventHandler>(
    (e) => {
      // Global bulk action
      if (e.shiftKey && isBulkActionEnabled) {
        e.stopPropagation();
        e.preventDefault();

        if (isSmartScheduleLoading || isBulkActionLoading) {
          return;
        }

        const currentState = bulkActionSelectedCardsSharedState.value;

        const boardCards = {
          ...(currentState.selectedCards[boardId] ?? {}),
        };

        if (boardCards[cardId]) {
          delete boardCards[cardId];
        } else {
          boardCards[cardId] = true;
        }

        const newState = { ...currentState };

        if (Object.keys(boardCards).length === 0) {
          delete newState.selectedCards[boardId];
        } else {
          newState.selectedCards[boardId] = boardCards;
        }

        bulkActionSelectedCardsSharedState.setValue(() => newState);
        return;
      }
    },
    [
      boardId,
      cardId,
      isBulkActionEnabled,
      isSmartScheduleLoading,
      isBulkActionLoading,
    ],
  );
};
