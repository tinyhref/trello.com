import type { Reference } from '@apollo/client/utilities';
import { useCallback } from 'react';

import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useMemberInboxIds } from '@trello/personal-workspace';
import { calculateItemPosition } from '@trello/position';

import { bulkActionSelectedCardsSharedState } from 'app/src/components/BulkAction/bulkActionSelectedCardsSharedState';
import { readListVisibleCardsFromCache } from 'app/src/components/List/readListVisibleCardsFromCache';
import type { BulkMoveCardsMutationVariables } from './BulkMoveCardsMutation.generated';
import { useBulkMoveCardsMutation } from './BulkMoveCardsMutation.generated';

export interface BulkMoveCardsArgs {
  cardIds: BulkMoveCardsMutationVariables['cardIds'];
  listId?: string;
  idBoard: BulkMoveCardsMutationVariables['idBoard'];
  posIndex: number;
  targetBoardId: BulkMoveCardsMutationVariables['targetBoardId'];
  targetListId: BulkMoveCardsMutationVariables['targetListId'];
  source?: SourceType;
}

export function useBulkCardMove() {
  const [bulkMoveCardsMutation] = useBulkMoveCardsMutation();
  const { idBoard: memberInboxBoardId } = useMemberInboxIds();

  const bulkMoveCards = useCallback(
    async ({
      cardIds,
      listId,
      idBoard,
      posIndex,
      targetBoardId,
      targetListId,
      source = 'moveCardInlineDialog',
    }: BulkMoveCardsArgs) => {
      let traceId: string | undefined;
      try {
        bulkActionSelectedCardsSharedState.setValue((prevState) => ({
          ...prevState,
          isLoading: true,
        }));

        const cardsInList = readListVisibleCardsFromCache({
          boardId: targetBoardId,
          listId: targetListId,
        });

        const pos = calculateItemPosition(posIndex, cardsInList);

        const isMoveWithinBoard = idBoard === targetBoardId;
        const isInboxMove =
          idBoard === memberInboxBoardId ||
          targetBoardId === memberInboxBoardId;

        if (typeof cardIds === 'string') {
          cardIds = [cardIds];
        }

        const numSelectedCards = cardIds.length;

        let field: 'idBoard' | 'idList' | 'pos' | undefined = undefined;
        if (!isMoveWithinBoard) {
          field = 'idBoard';
        } else if (listId) {
          field = listId === targetListId ? 'pos' : 'idList';
        }

        traceId = Analytics.startTask({
          taskName: 'edit-card-bulk/idBoard',
          source,
        });

        await bulkMoveCardsMutation({
          variables: {
            cardIds,
            idBoard,
            pos: pos.toString(),
            targetBoardId,
            targetListId,
            traceId,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            bulkMoveCards: {
              idBoard: targetBoardId,
              cards: cardIds.map((id, index) => ({
                id,
                idBoard: targetBoardId,
                idList: targetListId,
                pos: pos + index,
                __typename: 'Card',
              })),
              __typename: 'BulkMoveCards_Response',
            },
          },
          update(cache, { data }) {
            const updatedCards = data?.bulkMoveCards?.cards;

            // If we're moving the cards across boards, optimistically add them to
            // the target board's list of cards
            if (updatedCards && !isMoveWithinBoard) {
              cache.modify({
                id: cache.identify({ __typename: 'Board', id: targetBoardId }),
                fields: {
                  cards(existingRefs = [], { readField, toReference }) {
                    const existingIds = new Set<string>(
                      existingRefs.map((ref: Reference) =>
                        readField('id', ref),
                      ),
                    );

                    const refsToAdd = updatedCards
                      .filter((card) => !existingIds.has(card.id))
                      .map((card) =>
                        toReference({ __typename: 'Card', id: card.id }),
                      );

                    if (!refsToAdd.length) {
                      return existingRefs;
                    }

                    return [...existingRefs, ...refsToAdd];
                  },
                },
              });
            }
          },
        });

        bulkActionSelectedCardsSharedState.setValue(() => ({
          selectedCards: {},
          isLoading: false,
        }));

        if (field) {
          Analytics.sendUpdatedCardFieldEvent({
            field,
            source,
            attributes: {
              taskId: traceId,
              numSelectedCards,
              cardIds,
            },
            containers: formatContainers({
              idBoard: targetBoardId,
              idList: targetListId,
            }),
          });
        }

        if (isInboxMove) {
          // Moving a card from/to/within the inbox
          Analytics.sendTrackEvent({
            action: 'moved',
            actionSubject: 'card',
            source,
            attributes: {
              sameBoard: isMoveWithinBoard,
              numSelectedCards,
              cardIds,
            },
          });
        }

        Analytics.taskSucceeded({
          taskName: 'edit-card-bulk/idBoard',
          source,
          traceId,
        });
      } catch (error) {
        bulkActionSelectedCardsSharedState.setValue((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        if (traceId) {
          Analytics.taskFailed({
            taskName: 'edit-card-bulk/idBoard',
            source,
            traceId,
            error,
          });
        }
        throw error;
      }
    },
    [bulkMoveCardsMutation, memberInboxBoardId],
  );

  return { bulkMoveCards };
}
