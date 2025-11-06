import type { InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';
import { dangerouslyGetFeatureGateSync } from '@trello/feature-gate-client';

import type { TrelloList } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncNativeToRestScalars } from './syncNativeToRestScalars';
import { syncNestedModelReference } from './syncNestedModelReference';
import { isNumber, isString, nullOrString } from './validateHelpers';

/** Exported for testing only! */
export const fieldMappings = {
  name: { validate: isString },
  position: { validate: isNumber, key: 'pos' },
  color: { validate: nullOrString },
};

/**
 * Given native TrelloList data, writes all list data to the List model
 * in the Apollo Cache
 * @param incoming A partial TrelloList model
 * @param cache The cache to write to
 */
export const syncTrelloListToList = (
  incoming: RecursivePartial<TrelloList>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  try {
    const listId = getObjectIdFromCacheObject(incoming, readField);
    const list: TargetModel = { type: 'List', id: listId };
    syncNativeToRestScalars<TrelloList>(
      list,
      fieldMappings,
      incoming,
      cache,
      readField,
    );

    // This syncing is for queries and subscriptions that are structured board->list->card
    // For queries structured card->list->board, this code will not run and syncing is instead
    // handled in syncTrelloCardToCard
    const isCardBackCacheSyncingEnabled = dangerouslyGetFeatureGateSync(
      'goo_card_back_cache_syncing',
    );
    if (isCardBackCacheSyncingEnabled && incoming.cards?.edges) {
      incoming.cards.edges.forEach((edge) => {
        const card = edge?.node;
        if (!card) {
          return;
        }

        const cardId = getObjectIdFromCacheObject(card, readField);

        syncNestedModelReference(
          { type: 'Card', id: cardId },
          {
            model: { id: listId, type: 'List' },
            fieldName: 'list',
            idFieldName: 'idList',
          },
          cache,
        );
      });
    }
  } catch (err) {
    sendErrorEvent(err);
  }
};
