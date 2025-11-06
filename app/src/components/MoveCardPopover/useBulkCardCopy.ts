import { useCallback } from 'react';

import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { calculateItemPosition } from '@trello/position';

import { readListVisibleCardsFromCache } from 'app/src/components/List/readListVisibleCardsFromCache';
import type { BulkCopyCardsMutationVariables } from './BulkCopyCardsMutation.generated';
import { useBulkCopyCardsMutation } from './BulkCopyCardsMutation.generated';
import type { OptionalKeepFromSource } from './useSubmitCopy';

export interface BulkCopyCardsArgs {
  cardIds: BulkCopyCardsMutationVariables['cardIds'];
  idBoard: BulkCopyCardsMutationVariables['idBoard'];
  posIndex: number;
  targetBoardId: BulkCopyCardsMutationVariables['targetBoardId'];
  targetListId: BulkCopyCardsMutationVariables['targetListId'];
  source?: SourceType;
  title?: string;
  keepOptions?: OptionalKeepFromSource;
}

export function useBulkCardCopy() {
  const [bulkCopyCardsMutation] = useBulkCopyCardsMutation();

  const bulkCopyCards = useCallback(
    async ({
      cardIds,
      idBoard,
      posIndex,
      targetBoardId,
      targetListId,
      source,
    }: BulkCopyCardsArgs) => {
      let traceId: string | undefined;
      try {
        const cardsInList = readListVisibleCardsFromCache({
          boardId: targetBoardId,
          listId: targetListId,
        });

        const pos = calculateItemPosition(posIndex, cardsInList);

        traceId = Analytics.startTask({
          taskName: 'create-card/copy-bulk',
          source: source || 'copyCardInlineDialog',
        });

        await bulkCopyCardsMutation({
          variables: {
            cardIds,
            idBoard,
            pos: pos.toString(),
            targetBoardId,
            targetListId,
            traceId,
          },
        });

        Analytics.sendTrackEvent({
          action: 'copied',
          actionSubject: 'card',
          source: source || 'copyCardInlineDialog',
          attributes: {
            numSelectedCards: cardIds.length,
          },
        });

        Analytics.taskSucceeded({
          taskName: 'create-card/copy-bulk',
          source: source || 'copyCardInlineDialog',
          traceId,
        });
      } catch (error) {
        if (traceId) {
          Analytics.taskFailed({
            taskName: 'create-card/copy-bulk',
            source: source || 'copyCardInlineDialog',
            traceId,
            error,
          });
        }
        throw error;
      }
    },
    [bulkCopyCardsMutation],
  );

  return { bulkCopyCards };
}
