import type { Board, List } from '../../generated';
import type { TypedPartialWithID } from '../../types';
import type { BoardListsPatcherQuery } from './BoardListsPatcherQuery.generated';
import { BoardListsPatcherDocument } from './BoardListsPatcherQuery.generated';
import { GeneralizedFilterPatcher } from './generalizedFilterPatcher';

export const boardListsPatcher = new GeneralizedFilterPatcher<
  TypedPartialWithID<List, 'List'>,
  Board,
  BoardListsPatcherQuery,
  string
>({
  parentTypeName: 'Board',
  modelTypeName: 'List',
  filters: {
    open: {
      dataKey: 'listsOpen',
      addSingleRelationWhen: (list) => !list.closed,
      removeSingleRelationWhen: (list, boardId, previousBoardId) =>
        !!list.closed || (!!previousBoardId && boardId !== previousBoardId),
      // multi relational deltas not used right now
      addMultiRelationWhen: () => false,
      removeMultiRelationWhen: () => false,
    },
    closed: {
      dataKey: 'listsClosed',
      addSingleRelationWhen: (list) => !!list.closed,
      removeSingleRelationWhen: (list, boardId, previousBoardId) =>
        !list.closed || (!!previousBoardId && boardId !== previousBoardId),
      // multi relational deltas not used right now
      addMultiRelationWhen: () => false,
      removeMultiRelationWhen: () => false,
    },
    all: {
      dataKey: 'lists',
      addSingleRelationWhen: () => true,
      removeSingleRelationWhen: (_, boardId, previousBoardId) =>
        !!previousBoardId && boardId !== previousBoardId,
      // multi relational deltas not used right now
      addMultiRelationWhen: () => false,
      removeMultiRelationWhen: () => false,
    },
  },
  query: BoardListsPatcherDocument,
});
