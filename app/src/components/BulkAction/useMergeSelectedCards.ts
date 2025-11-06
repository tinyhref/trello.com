import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { showFlag } from '@trello/nachos/experimental-flags';

import { bulkActionSelectedCardsSharedState } from './bulkActionSelectedCardsSharedState';
import { useTrelloMergeCardsMutation } from './TrelloMergeCardsMutation.generated';

interface MergeSelectedCardsArgs {
  source: SourceType;
  targetBoardId: string;
  targetListId: string;
}

/**
 * Merge cards selected via bulk action/multi-select
 * @param source - The source of the merge
 * @param targetBoardId - The ID of the target board
 * @param targetListId - The ID of the target list
 * @returns A function to merge the selected cards
 */
export const useMergeSelectedCards = ({
  source,
  targetBoardId,
  targetListId,
}: MergeSelectedCardsArgs) => {
  const intl = useIntl();
  const [mergeCards] = useTrelloMergeCardsMutation();

  const showErrorFlag = useCallback(() => {
    showFlag({
      id: 'merge-cards-error',
      title: intl.formatMessage({
        id: 'templates.bulk-actions.unable-to-merge-cards',
        defaultMessage: 'Unable to merge cards',
        description: 'Unable to merge cards error flag message',
      }),
      appearance: 'error',
      isAutoDismiss: true,
    });
  }, [intl]);

  return async () => {
    if (!targetBoardId || !targetListId) {
      return;
    }

    const selectedCards =
      bulkActionSelectedCardsSharedState.value.selectedCards;

    const cardIds: string[] = [];
    Object.entries(selectedCards).forEach(([_, cards]) => {
      Object.entries(cards).forEach(([cardId, isSelected]) => {
        if (isSelected) {
          cardIds.push(cardId);
        }
      });
    });

    if (cardIds.length < 2) {
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'edit-card-bulk/merge',
      source,
    });

    bulkActionSelectedCardsSharedState.setValue(() => ({
      selectedCards,
      isLoading: true,
    }));

    try {
      const result = await mergeCards({
        variables: {
          cardIds,
          targetBoardId,
          targetListId,
        },
      });

      if (result.errors) {
        showErrorFlag();
        return;
      }

      if (!result.data?.trello?.mergeCards?.success) {
        showErrorFlag();
        return;
      }

      Analytics.taskSucceeded({
        taskName: 'edit-card-bulk/merge',
        traceId,
        source,
      });
    } catch (error) {
      Analytics.taskFailed({
        taskName: 'edit-card-bulk/merge',
        traceId,
        source,
        error,
      });

      showErrorFlag();
    }

    bulkActionSelectedCardsSharedState.setValue(() => ({
      selectedCards: {},
      isLoading: false,
    }));
  };
};
