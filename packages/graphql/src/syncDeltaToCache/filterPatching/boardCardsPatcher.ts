import type { Board, Card } from '../../generated';
import type { TypedPartialWithID } from '../../types';
import type { BoardCardsPatcherQuery } from './BoardCardsPatcherQuery.generated';
import { BoardCardsPatcherDocument } from './BoardCardsPatcherQuery.generated';
import { GeneralizedFilterPatcher } from './generalizedFilterPatcher';

export const boardCardsPatcher = new GeneralizedFilterPatcher<
  TypedPartialWithID<Card, 'Card'>,
  Board,
  BoardCardsPatcherQuery,
  string
>({
  parentTypeName: 'Board',
  modelTypeName: 'Card',
  filters: {
    open: {
      dataKey: 'cardsOpen',
      addSingleRelationWhen: (card) => card.closed === false,
      removeSingleRelationWhen: (card, boardId, previousBoardId) =>
        card.closed === true ||
        (!!previousBoardId && boardId !== previousBoardId),
      addMultiRelationWhen: () => false,
      removeMultiRelationWhen: () => false,
    },
    visible: {
      dataKey: 'cardsVisible',
      addSingleRelationWhen: (card) => card.closed === false,
      removeSingleRelationWhen: (card, boardId, previousBoardId) =>
        card.closed === true ||
        (!!previousBoardId && boardId !== previousBoardId),
      addMultiRelationWhen: () => false,
      removeMultiRelationWhen: () => false,
    },
    closed: {
      dataKey: 'cardsClosed',
      addSingleRelationWhen: (card) => card.closed === true,
      removeSingleRelationWhen: (card, boardId, previousBoardId) =>
        card.closed === false ||
        (!!previousBoardId && boardId !== previousBoardId),
      addMultiRelationWhen: () => false,
      removeMultiRelationWhen: () => false,
    },
    all: {
      dataKey: 'cards',
      addSingleRelationWhen: () => true,
      removeSingleRelationWhen: (_, boardId, previousBoardId) =>
        !!previousBoardId && boardId !== previousBoardId,
      addMultiRelationWhen: () => false,
      removeMultiRelationWhen: () => false,
    },
  },
  query: BoardCardsPatcherDocument,
});
