import type { Board, Organization } from '../../generated';
import type { TypedPartialWithID } from '../../types';
import { GeneralizedFilterPatcher } from './generalizedFilterPatcher';
import type { OrganizationBoardsPatcherQuery } from './OrganizationBoardsPatcherQuery.generated';
import { OrganizationBoardsPatcherDocument } from './OrganizationBoardsPatcherQuery.generated';

export const organizationBoardsPatcher = new GeneralizedFilterPatcher<
  TypedPartialWithID<Board, 'Board'>,
  Organization,
  OrganizationBoardsPatcherQuery,
  string
>({
  parentTypeName: 'Organization',
  modelTypeName: 'Board',
  filters: {
    open: {
      dataKey: 'boardsOpen',
      addSingleRelationWhen: (board) => !board.closed,
      removeSingleRelationWhen: (board) => !!board.closed,
      addMultiRelationWhen: () => false,
      removeMultiRelationWhen: () => false,
    },
    closed: {
      dataKey: 'boardsClosed',
      addSingleRelationWhen: (board) => !!board.closed,
      removeSingleRelationWhen: (board) => !board.closed,
      addMultiRelationWhen: () => false,
      removeMultiRelationWhen: () => false,
    },
    all: {
      dataKey: 'boards',
      addSingleRelationWhen: () => true,
      removeSingleRelationWhen: () => false,
      addMultiRelationWhen: () => false,
      removeMultiRelationWhen: () => false,
    },
  },
  query: OrganizationBoardsPatcherDocument,
});
