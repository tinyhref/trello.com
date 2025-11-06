import { gql, type InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';

import type { TrelloCheckItem } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncNativeNestedObjectToRest } from './syncNativeNestedObjectToRest';
import { syncNativeToRestScalars } from './syncNativeToRestScalars';
import {
  isEnumString,
  isNumber,
  isString,
  nullOrNumber,
  nullOrString,
} from './validateHelpers';

const dueInfoFieldMappings = {
  at: {
    validate: nullOrString,
    key: 'due',
  },
  reminder: { validate: nullOrNumber, key: 'dueReminder' },
};

const generateCheckItemDueFragment = (field: string) => {
  return `fragment CheckItem${field}Write on CheckItem {
    id
    ${field}
  }`;
};

const generateCheckItemDueData = (
  id: string,
  field: string,
  value: unknown,
) => {
  return {
    __typename: 'CheckItem',
    id,
    [field]: value,
  };
};

/**
 * Given native TrelloCheckItem data, writes all check item data to the CheckItem model
 * in the Apollo Cache
 * @param incoming A partial TrelloCheckItem model
 * @param cache The cache to write to
 */
export const syncTrelloCheckItemToCheckItem = (
  incoming: RecursivePartial<TrelloCheckItem>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  try {
    const checkItemId = getObjectIdFromCacheObject(incoming, readField);
    const checkItem: TargetModel = { type: 'CheckItem', id: checkItemId };

    const scalarFieldMappings = {
      member: {
        fetchValue: (data: RecursivePartial<TrelloCheckItem>) => {
          const member = data.member;
          return member
            ? getObjectIdFromCacheObject(member, readField)
            : member;
        },
        validate: nullOrString,
        key: 'idMember',
      },
      name: {
        fetchValue: (data: RecursivePartial<TrelloCheckItem>) => {
          const name = data.name;
          return name ? name.text : name;
        },
        validate: isString,
      },
      position: { validate: isNumber, key: 'pos' },
      state: {
        validate: (val: unknown) =>
          isEnumString(val, ['COMPLETE', 'INCOMPLETE']),
        transform: (val: string) => val.toLowerCase(),
      },
    };

    syncNativeToRestScalars<TrelloCheckItem>(
      checkItem,
      scalarFieldMappings,
      incoming,
      cache,
      readField,
    );

    const dueInfo = incoming.due;
    if (dueInfo !== undefined) {
      syncNativeNestedObjectToRest(
        checkItem,
        dueInfoFieldMappings,
        generateCheckItemDueFragment,
        generateCheckItemDueData,
        {
          ...(dueInfo ?? { at: null, reminder: -1 }),
          __typename: 'TrelloCheckItemDueInfo',
        },
        cache,
      );
    }

    // CheckItem.nameData is for custom emojis
    // We don't support this in the GQL API so we'll just write a default blank value to this field
    cache.writeFragment({
      id: cache.identify({ __typename: checkItem.type, id: checkItem.id }),
      fragment: gql`
        fragment CheckItemNameDataWrite on CheckItem {
          id
          nameData
        }
      `,
      data: {
        __typename: 'CheckItem',
        id: checkItem.id,
        nameData: '{"emoji":{}}',
      },
    });
  } catch (err) {
    sendErrorEvent(err);
  }
};
