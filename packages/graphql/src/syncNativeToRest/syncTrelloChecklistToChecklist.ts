import { type InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';

import type { TrelloChecklist } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncListsOfModelRefs } from './syncListsOfModelRefs';
import { syncNativeToRestScalars } from './syncNativeToRestScalars';
import { isNumber, isString } from './validateHelpers';

/** Exported for testing only! */
export const scalarFieldMappings = {
  // technically these are nullable in the server side schema, but non-nullable in the client side schema.
  name: { validate: isString },
  position: { validate: isNumber, key: 'pos' },
};

/**
 * Given native TrelloChecklist data, writes all checklist data to the
 * Checklist model in the Apollo Cache
 * @param incoming A partial TrelloChecklist model
 * @param cache The cache to write to
 * @param readField A function to read fields from cache references
 */
export const syncTrelloChecklistToChecklist = (
  incoming: RecursivePartial<TrelloChecklist>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  try {
    const checklistId = getObjectIdFromCacheObject(incoming, readField);
    const checklist: TargetModel = { type: 'Checklist', id: checklistId };

    syncListsOfModelRefs(
      checklist,
      {
        checkItems: {
          type: 'CheckItem',
          parentIdFieldName: 'idChecklist',
        },
      },
      incoming,
      cache,
      readField,
    );

    syncNativeToRestScalars(
      checklist,
      scalarFieldMappings,
      incoming,
      cache,
      readField,
    );
  } catch (err) {
    sendErrorEvent(err);
  }
};
