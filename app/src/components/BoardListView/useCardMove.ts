import { useCallback } from 'react';

import { announceToLiveRegion } from '@trello/a11y';
import { ActionHistory } from '@trello/action-history';
import type { SourceType, Task } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useFeatureGate } from '@trello/feature-gate-client';
import { client, optimisticIdManager } from '@trello/graphql';
import type { BoardListsContextCardFragment } from '@trello/graphql/fragments';
import { BoardListsContextCardFragmentDoc } from '@trello/graphql/fragments';
import { intl } from '@trello/i18n';
import { useBoardId } from '@trello/id-context';
import { getScreenFromUrl } from '@trello/marketing-screens';
import type { Board, Card } from '@trello/model-types';
import { useMemberInboxIds } from '@trello/personal-workspace';
import { calculateItemPosition } from '@trello/position';

import { readListVisibleCardsFromCache } from 'app/src/components/List/readListVisibleCardsFromCache';
import { fireCardFrontConfetti } from './fireCardFrontConfetti';
import { useMoveCardMutation } from './MoveCardMutation.generated';

type MoveCardArgs = {
  cardId: string;
  listId: string;
  index: number;
  confettiTargetElement?: Element | null;
  boardId?: string;
  inboxBoardId?: string;
  sourceType?: SourceType;
};

type MoveType =
  | 'board_to_board'
  | 'board_to_inbox'
  | 'inbox_to_board'
  | 'inbox_to_inbox';

type CardMoveTask = Extract<
  Task,
  | 'edit-card/idBoard'
  | 'edit-card/idList'
  | 'edit-card/move/inbox'
  | 'edit-card/pos'
  | 'edit-inbox-card/move/board'
  | 'edit-inbox-card/move/inbox'
>;

export function useCardMove() {
  const currentBoardId = useBoardId();
  const [moveCardMutation] = useMoveCardMutation();
  const { idBoard: memberInboxBoardId, idList: memberInboxListId } =
    useMemberInboxIds();

  const { value: isOptimisticallyClearCardUrlOnMoveEnabled } = useFeatureGate(
    'trello_optimistically_clear_card_url_on_move',
  );

  const moveCard = useCallback(
    async ({
      cardId,
      listId,
      index,
      confettiTargetElement,
      boardId = currentBoardId,
      inboxBoardId = memberInboxBoardId,
      sourceType,
    }: MoveCardArgs) => {
      const cards = readListVisibleCardsFromCache({ boardId, listId });
      const card = client.readFragment<BoardListsContextCardFragment>(
        {
          id: `Card:${cardId}`,
          fragment: BoardListsContextCardFragmentDoc,
        },
        true,
      );

      if (!cards || !card) {
        return;
      }

      const originalBoardId = card.idBoard;
      const isMoveWithinBoard = originalBoardId === boardId;
      const isMoveWithinList = card.idList === listId;
      const isInboxMove =
        listId === memberInboxListId || originalBoardId === memberInboxBoardId;
      const isCurrentlyInInbox = card.idBoard === inboxBoardId;
      let moveType: MoveType;
      if (isCurrentlyInInbox) {
        if (inboxBoardId === boardId) {
          moveType = 'inbox_to_inbox';
        } else {
          moveType = 'inbox_to_board';
        }
      } else {
        if (boardId === inboxBoardId) {
          moveType = 'board_to_inbox';
        } else {
          moveType = 'board_to_board';
        }
      }

      // Store this value before we mutate the list.
      const numCardsInTargetList = cards.length;
      // 1e9 is often supplied as a shortcut for moving a card to the bottom of
      // a list, so we normalize it here to identify whether we should noop,
      // but moving an archived card will always add to the length of the target list,
      // so don't use the normalized targetIndex in that case
      const targetIndex = !card.closed
        ? Math.min(
            isMoveWithinList ? numCardsInTargetList - 1 : numCardsInTargetList,
            index,
          )
        : index;

      if (isMoveWithinList) {
        const currentIndex = cards.findIndex(({ id }) => id === cardId);
        // The card is already in the right place, noop.
        if (currentIndex === targetIndex) {
          return;
        }
      }

      // if an archived card is being moved within the same board, then un-archive it
      // if an archived card is being moved to a new target board, then keep it archived
      const closed = isMoveWithinBoard ? false : card.closed;

      let field: 'idBoard' | 'idList' | 'pos' = 'pos';
      if (!isMoveWithinBoard) {
        field = 'idBoard';
      } else if (!isMoveWithinList) {
        field = 'idList';
      } else {
        field = 'pos';
      }

      let source: SourceType;
      if (sourceType) {
        source = sourceType;
      } else if (isCurrentlyInInbox) {
        source = 'inboxScreen';
      } else {
        source = getScreenFromUrl();
      }

      let taskName: CardMoveTask;
      switch (moveType) {
        case 'inbox_to_inbox':
          taskName = 'edit-inbox-card/move/inbox';
          break;
        case 'inbox_to_board':
          taskName = 'edit-inbox-card/move/board';
          break;
        case 'board_to_inbox':
          taskName = 'edit-card/move/inbox';
          break;
        default:
          taskName = `edit-card/${field}`;
      }

      const traceId = Analytics.startTask({ taskName, source });

      try {
        const position = calculateItemPosition(targetIndex, cards, card);

        let resolvedCardId = cardId;
        if (optimisticIdManager.isOptimisticId(cardId)) {
          client.cache.modify<Card>({
            id: client.cache.identify({
              id: cardId,
              __typename: 'Card',
            }),
            fields: { idList: () => listId, pos: () => position },
            optimistic: true,
          });
          resolvedCardId = await optimisticIdManager.waitForId(cardId);
        }

        // we need to get the sourceCards before we update the card position because the moved card is
        // still present in the list at this point.  Otherwise, we won't be able to get the correct index
        //  for where the card originated from for ActionHistory, changing the functionality of undo
        const sourceListId = card.idList;
        const sourceCards = readListVisibleCardsFromCache({
          boardId: currentBoardId,
          listId: sourceListId,
        });
        const sourceIndex =
          sourceCards?.findIndex(({ id }) => id === cardId) ?? 1e9;

        if (card.idList !== listId && confettiTargetElement) {
          fireCardFrontConfetti({ listId }, confettiTargetElement);
        }

        // Prevents the card from being opened until the mutation resolves.
        // Attempts to open a cross-board moving card can result in a 404 response.
        if (isOptimisticallyClearCardUrlOnMoveEnabled && !isMoveWithinBoard) {
          client.cache.modify<Card>({
            id: `Card:${resolvedCardId}`,
            fields: { url: () => '' },
          });
        }

        await moveCardMutation({
          variables: {
            cardId: resolvedCardId,
            card: {
              idList: listId,
              idBoard: boardId,
              pos: position,
              closed,
            },
            traceId,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateCard: {
              id: resolvedCardId,
              idBoard: boardId,
              idList: listId,
              pos: position,
              closed,
              __typename: 'Card',
            },
          },
          update(cache, { data }) {
            const updatedCard = data?.updateCard;

            // If we're moving the card across boards, optimistically add it to
            // the target board's list of cards, and remove it from the source.
            if (updatedCard && !isMoveWithinBoard) {
              cache.modify<Board>({
                id: cache.identify({
                  id: originalBoardId,
                  __typename: 'Board',
                }),
                fields: {
                  cards(cardsRef = [], { readField }) {
                    return cardsRef.filter(
                      (ref) => readField('id', ref) !== updatedCard.id,
                    );
                  },
                },
              });

              cache.modify<Board>({
                id: cache.identify({
                  id: boardId,
                  __typename: 'Board',
                }),
                fields: {
                  cards(cardsRef = [], { readField, toReference }) {
                    const fullCardRef = toReference(updatedCard);
                    if (
                      !fullCardRef ||
                      cardsRef.some((ref) => {
                        const refId = readField('id', ref);
                        return refId === updatedCard.id;
                      })
                    ) {
                      return cardsRef;
                    }
                    return cardsRef.concat(fullCardRef);
                  },
                },
              });
            }
          },
        });

        Analytics.sendUpdatedCardFieldEvent({
          field,
          source,
          attributes: { taskId: traceId },
          containers: formatContainers({
            idCard: resolvedCardId,
            idBoard: boardId,
            idList: listId,
          }),
        });

        Analytics.taskSucceeded({ taskName, source, traceId });

        if (isInboxMove) {
          // Moving a card from/to/within the inbox
          Analytics.sendTrackEvent({
            action: 'moved',
            actionSubject: 'card',
            source,
            attributes: {
              sameBoard: isMoveWithinBoard,
              suggested: false,
              containerType: 'inbox',
            },
            containers: formatContainers({
              idCard: resolvedCardId,
              idBoard: boardId,
              idList: listId,
            }),
          });
        }

        let recordedPosition: number | 'bottom' | 'top' = targetIndex;
        if (targetIndex === 0 && numCardsInTargetList > 0) {
          recordedPosition = 'top';
        } else if (
          (targetIndex === numCardsInTargetList ||
            (isMoveWithinList && targetIndex === numCardsInTargetList - 1)) &&
          numCardsInTargetList > 1
        ) {
          recordedPosition = 'bottom';
        }

        ActionHistory.append(
          {
            type: 'move',
            idBoard: boardId,
            idList: listId,
            position: recordedPosition,
            fromPosition: sourceIndex,
          },
          {
            idCard: resolvedCardId,
            idBoard: currentBoardId,
            idList: sourceListId,
            idLabels: [],
            idMembers: [], // isn't actually used, so don't bother hydrating.
          },
        );

        announceToLiveRegion(
          intl.formatMessage(
            {
              id: 'templates.shortcuts.card-moved-announcement',
              defaultMessage: 'The card {cardName} was moved',
              description:
                'The message to announce by the screen reader when a card is moved',
            },
            { cardName: card?.name || '' },
          ),
        );
      } catch (error) {
        Analytics.taskFailed({ taskName, source, traceId, error });
        throw error;
      }
    },
    [
      currentBoardId,
      memberInboxBoardId,
      memberInboxListId,
      isOptimisticallyClearCardUrlOnMoveEnabled,
      moveCardMutation,
    ],
  );

  return {
    moveCard,
  };
}
