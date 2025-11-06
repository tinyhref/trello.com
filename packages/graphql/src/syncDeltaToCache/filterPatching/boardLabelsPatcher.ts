import type { Board, Label } from '../../generated';
import type { TypedPartialWithID } from '../../types';
import type { BoardLabelsPatcherQuery } from './BoardLabelsPatcherQuery.generated';
import { BoardLabelsPatcherDocument } from './BoardLabelsPatcherQuery.generated';
import { GeneralizedFilterPatcher } from './generalizedFilterPatcher';

export const boardLabelsPatcher = new GeneralizedFilterPatcher<
  TypedPartialWithID<Label, 'Label'>,
  Board,
  BoardLabelsPatcherQuery,
  string
>({
  parentTypeName: 'Board',
  modelTypeName: 'Label',
  filters: {
    default: {
      dataKey: 'labels',
      addSingleRelationWhen: () => true,
      // The remove case is already handled by syncDeltaToCache _delta.deleted logic
      removeSingleRelationWhen: () => false,
      // MultiRelation doesn't apply to board <-> label relationship
      addMultiRelationWhen: () => false,
      removeMultiRelationWhen: () => false,
    },
    all: {
      dataKey: 'labelsAll',
      addSingleRelationWhen: () => true,
      // The remove case is already handled by syncDeltaToCache _delta.deleted logic
      removeSingleRelationWhen: () => false,
      // MultiRelation doesn't apply to board <-> label relationship
      addMultiRelationWhen: () => false,
      removeMultiRelationWhen: () => false,
    },
  },
  query: BoardLabelsPatcherDocument,
});
