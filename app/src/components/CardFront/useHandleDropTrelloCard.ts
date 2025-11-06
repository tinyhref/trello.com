import { useCallback } from 'react';

import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { DropTargetRecord } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import type { ExternalDragPayload } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { client } from '@trello/graphql';
import type { BoardListsContextCardFragment } from '@trello/graphql/fragments';
import { BoardListsContextCardFragmentDoc } from '@trello/graphql/fragments';
import { useBoardId, useListId } from '@trello/id-context';

import { useCardMove } from 'app/src/components/BoardListView/useCardMove';
import { onDropCard } from 'app/src/components/List/cardDragAndDropState';
import { readListVisibleCardsFromCache } from 'app/src/components/List/readListVisibleCardsFromCache';
import { getTrelloCardFromExternalData } from './getTrelloCardFromExternalData';

interface UseHandleDropTrelloCardOptions {
  cardId: string;
}

export const useHandleDropTrelloCard = ({
  cardId,
}: UseHandleDropTrelloCardOptions) => {
  const boardId = useBoardId();
  const { moveCard } = useCardMove();
  const listId = useListId();

  const handleDropTrelloCard = useCallback(
    async (source: ExternalDragPayload, self: DropTargetRecord) => {
      const currentClosestEdge = extractClosestEdge(self.data);
      const cards = readListVisibleCardsFromCache({ boardId, listId });
      const cardIndex =
        cards.findIndex(({ id }) => id === cardId) ?? cards.length;

      const {
        cardId: originalCardId,
        listId: originalListId,
        position: originalPosition,
        boardId: originalBoardId,
        cardRole,
        pinned,
        name: originalCardName,
        dueComplete,
      } = await getTrelloCardFromExternalData(source);

      const newCardIndex =
        currentClosestEdge === 'bottom' ? cardIndex + 1 : cardIndex;

      // moveCard expects the card to be in the cache, so we need to add it if it's not there
      // (eg we dragged a card from another board this window hasn't visited)
      const cachedCard = client.readFragment<BoardListsContextCardFragment>({
        id: `Card:${originalCardId}`,
        fragment: BoardListsContextCardFragmentDoc,
      });

      // card isn't already in the cache, add it real quick
      if (!cachedCard) {
        client.writeFragment<BoardListsContextCardFragment>({
          fragment: BoardListsContextCardFragmentDoc,
          id: `Card:${originalCardId}`,
          data: {
            id: originalCardId,
            pos: originalPosition || 0,
            closed: false,
            idBoard: originalBoardId,
            idList: originalListId,
            cardRole: cardRole ?? null,
            pinned: pinned ?? false,
            name: originalCardName || '',
            dueComplete: dueComplete ?? false,
            __typename: 'Card',
          },
        });
      }

      moveCard({
        cardId: originalCardId,
        listId,
        index: newCardIndex,
        boardId,
      });
      onDropCard();
    },
    [boardId, cardId, listId, moveCard],
  );

  return { handleDropTrelloCard };
};
