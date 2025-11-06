import type { Board, Member } from '../../generated';
import type { TypedPartialWithID } from '../../types';
import { GeneralizedFilterPatcher } from './generalizedFilterPatcher';
import type { MemberBoardsPatcherQuery } from './MemberBoardsPatcherQuery.generated';
import { MemberBoardsPatcherDocument } from './MemberBoardsPatcherQuery.generated';

export const memberBoardsPatcher = new GeneralizedFilterPatcher<
  TypedPartialWithID<Board, 'Board'>,
  Member,
  MemberBoardsPatcherQuery,
  string
>({
  parentTypeName: 'Member',
  modelTypeName: 'Board',
  filters: {
    open: {
      dataKey: 'boardsOpen',
      addSingleRelationWhen: (board) => board.closed === false,
      removeSingleRelationWhen: (board) => board.closed === true,
      addMultiRelationWhen: (board, id, memberIds, previousMemberIds) =>
        memberIds.includes(id) && !previousMemberIds.includes(id),
      removeMultiRelationWhen: (board, id, memberIds, previousMemberIds) =>
        previousMemberIds.includes(id) && !memberIds.includes(id),
    },
    closed: {
      dataKey: 'boardsClosed',
      addSingleRelationWhen: (board) => board.closed === true,
      removeSingleRelationWhen: (board) => board.closed === false,
      addMultiRelationWhen: (board, id, memberIds, previousMemberIds) =>
        memberIds.includes(id) && !previousMemberIds.includes(id),
      removeMultiRelationWhen: (board, id, memberIds, previousMemberIds) =>
        previousMemberIds.includes(id) && !memberIds.includes(id),
    },
    openStarred: {
      dataKey: 'boardsOpenStarred',
      // we can't do starred additions right now, but this works mostly
      addSingleRelationWhen: (board) => board.closed === false,
      removeSingleRelationWhen: (board) => board.closed === true,
      // NOTE: this doesn't work for some cases, mainly when you use a different memberships
      // filter than all, such that relatedIds is undefined
      addMultiRelationWhen: (board, id, memberIds, previousMemberIds) =>
        board.closed === false ||
        (memberIds.includes(id) && !previousMemberIds.includes(id)),
      removeMultiRelationWhen: (board, id, memberIds, previousMemberIds) =>
        board.closed === true ||
        (previousMemberIds.includes(id) && !memberIds.includes(id)),
    },
    all: {
      dataKey: 'boards',
      addSingleRelationWhen: () => true,
      removeSingleRelationWhen: () => false,
      addMultiRelationWhen: (board, id, memberIds, previousMemberIds) =>
        memberIds.includes(id) && !previousMemberIds.includes(id),
      removeMultiRelationWhen: (board, id, memberIds, previousMemberIds) =>
        previousMemberIds.includes(id) && !memberIds.includes(id),
    },
  },
  query: MemberBoardsPatcherDocument,
});
