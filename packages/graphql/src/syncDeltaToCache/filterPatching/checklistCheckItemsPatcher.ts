import type { ApolloCache, NormalizedCacheObject } from '@apollo/client';

import type { CheckItem, Checklist } from '../../generated';
import type { TypedPartialWithID } from '../../types';
import type { ChecklistCheckItemsPatcherQuery } from './ChecklistCheckItemsPatcherQuery.generated';
import { ChecklistCheckItemsPatcherDocument } from './ChecklistCheckItemsPatcherQuery.generated';
import { GeneralizedFilterPatcher } from './generalizedFilterPatcher';

class ChecklistCheckItemsPatcher extends GeneralizedFilterPatcher<
  TypedPartialWithID<CheckItem, 'CheckItem'>,
  Checklist,
  // @ts-expect-error checkItems is unique because its camel case
  ChecklistCheckItemsPatcherQuery,
  string
> {
  constructor() {
    super({
      parentTypeName: 'Checklist',
      modelTypeName: 'CheckItem',
      filters: {
        default: {
          dataKey: 'checkItems',
          canSyncWithEmptyData: true,
          addSingleRelationWhen: () => true,
          removeSingleRelationWhen: () => false,
          // not used
          addMultiRelationWhen: () => true,
          removeMultiRelationWhen: () => false,
        },
        all: {
          dataKey: 'checkItemsAll',
          canSyncWithEmptyData: true,
          addSingleRelationWhen: () => true,
          removeSingleRelationWhen: () => false,
          // not used
          addMultiRelationWhen: () => true,
          removeMultiRelationWhen: () => false,
        },
        due: {
          dataKey: 'checkItemsDue',
          canSyncWithEmptyData: true,
          addSingleRelationWhen: (checkItem) => !!checkItem.due,
          removeSingleRelationWhen: (checkItem) => !checkItem.due,
          // not used
          addMultiRelationWhen: () => false,
          removeMultiRelationWhen: () => false,
        },
      },
      query: ChecklistCheckItemsPatcherDocument,
    });
  }

  public handleSubdocumentArrayDelta(
    cache: ApolloCache<NormalizedCacheObject>,
    checklist: Partial<Checklist> & { id: string; __typename: 'Checklist' },
  ) {
    const currentData = this.readQuery(cache, checklist.id);
    if (!currentData) {
      return;
    }
    const checkItems = checklist.checkItems ?? [];
    const result = {
      checkItems: checkItems.map((item) => ({
        __typename: 'CheckItem',
        id: item.id,
      })),
      checkItemsAll: checkItems.map((item) => ({
        __typename: 'CheckItem',
        id: item.id,
      })),
      checkItemsDue: checkItems
        .filter((item) => Boolean(item.due))
        .map((item) => ({ __typename: 'CheckItem', id: item.id })),
    };
    this.writeModels(cache, checklist.id, result);
  }
}

export const checklistCheckItemsPatcher = new ChecklistCheckItemsPatcher();
