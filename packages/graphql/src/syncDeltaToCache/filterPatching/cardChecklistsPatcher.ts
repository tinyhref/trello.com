import type { Card, Checklist } from '../../generated';
import type { TypedPartialWithID } from '../../types';
import type { CardChecklistsPatcherQuery } from './CardChecklistsPatcherQuery.generated';
import { CardChecklistsPatcherDocument } from './CardChecklistsPatcherQuery.generated';
import { GeneralizedFilterPatcher } from './generalizedFilterPatcher';

export const cardChecklistsPatcher = new GeneralizedFilterPatcher<
  TypedPartialWithID<Checklist, 'Checklist'>,
  Card,
  CardChecklistsPatcherQuery,
  string
>({
  parentTypeName: 'Card',
  modelTypeName: 'Checklist',
  filters: {
    default: {
      dataKey: 'checklists',
      addSingleRelationWhen: () => true,
      removeSingleRelationWhen: () => false,
      // not used
      addMultiRelationWhen: () => true,
      removeMultiRelationWhen: () => false,
    },
    all: {
      dataKey: 'checklistsAll',
      addSingleRelationWhen: () => true,
      removeSingleRelationWhen: () => false,
      // not used
      addMultiRelationWhen: () => true,
      removeMultiRelationWhen: () => false,
    },
    due: {
      dataKey: 'checklistsDue',
      addSingleRelationWhen: (checklist) =>
        !!checklist?.checkItems?.some(({ due }) => Boolean(due)),
      removeSingleRelationWhen: (checklist) =>
        !checklist?.checkItems?.some(({ due }) => Boolean(due)),
      // not used
      addMultiRelationWhen: () => false,
      removeMultiRelationWhen: () => false,
    },
  },
  query: CardChecklistsPatcherDocument,
});
