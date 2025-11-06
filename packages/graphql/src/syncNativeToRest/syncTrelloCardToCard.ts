import type { InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';
import { dangerouslyGetFeatureGateSync } from '@trello/feature-gate-client';

import type {
  TrelloBoard,
  TrelloCustomField,
  TrelloCustomFieldItemConnection,
  TrelloList,
} from '../generated';
import { type TrelloCard } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import {
  InvalidIdError,
  MissingIdError,
  wrapIdErrorInParent,
} from './cacheSyncingErrors';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncCardCover } from './syncCardCover';
import { syncCardDescription } from './syncCardDescription';
import { syncCardDueInfo } from './syncCardDueInfo';
import { syncCardLimits } from './syncCardLimits';
import { syncCardLocation } from './syncCardLocation';
import {
  syncListsOfModelRefs,
  type NestedModelListMapping,
} from './syncListsOfModelRefs';
import {
  syncNativeToRestScalars,
  type ScalarFieldMapping,
} from './syncNativeToRestScalars';
import { syncNestedModelListReferences } from './syncNestedModelListReferences';
import { syncNestedModelReference } from './syncNestedModelReference';
import { syncTrelloCardBadgesToCardBadges } from './syncTrelloCardBadgesToCardBadges';
import {
  isBool,
  isEnumString,
  isNumber,
  isObjectId,
  isString,
  nullOrNumber,
  nullOrString,
} from './validateHelpers';

/** Exported for testing purposes only */
export const scalarFieldMappings: ScalarFieldMapping<TrelloCard> = {
  complete: { validate: isBool, key: 'dueComplete' },
  closed: { validate: isBool },
  id: { validate: isString, key: 'nodeId' },
  isTemplate: { validate: isBool },
  lastActivityAt: { validate: isString, key: 'dateLastActivity' },
  mirrorSourceId: {
    validate: (value: unknown) => value === null || isObjectId(value),
  },
  name: { validate: isString },
  pinned: { validate: isBool },
  role: {
    validate: (value: unknown) =>
      value === null ||
      isEnumString(value, ['BOARD', 'LINK', 'MIRROR', 'SEPARATOR']),
    key: 'cardRole',
    transform: (value: string | null) => value?.toLowerCase() ?? null,
    sendValueToSentry: true,
  },
  shortId: { validate: isNumber, key: 'idShort' },
  shortLink: { validate: isString },
  singleInstrumentationId: { validate: isString },
  url: { validate: isString },
};

/**
 * Given native TrelloCard data, writes all card data to the Card model
 * in the Apollo Cache
 * @param incoming A partial TrelloCard model
 * @param cache The cache to write to
 */
export const syncTrelloCardToCard = (
  incoming: RecursivePartial<TrelloCard>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  const nestedListMappings: NestedModelListMapping<TrelloCard> = {
    attachments: { type: 'Attachment' as const },
    customFieldItems: { type: 'CustomFieldItem' as const },
    labels: { idFieldName: 'idLabels', type: 'Label' as const },
    members: { idFieldName: 'idMembers', type: 'Member' as const },
    powerUpData: { type: 'PluginData' as const, key: 'pluginData' },
    stickers: { type: 'Sticker' as const },
  };

  const isCardBackCacheSyncingEnabled = dangerouslyGetFeatureGateSync(
    'goo_card_back_cache_syncing',
  );

  // If FF is on, add mappings for card back cache syncing
  if (isCardBackCacheSyncingEnabled) {
    nestedListMappings['checklists'] = {
      idFieldName: 'idChecklists',
      type: 'Checklist' as const,
    };
    nestedListMappings['membersVoted'] = {
      idFieldName: 'idMembersVoted',
      type: 'Member' as const,
    };

    scalarFieldMappings['position'] = {
      validate: nullOrNumber,
      key: 'pos',
    };

    scalarFieldMappings['startedAt'] = {
      validate: nullOrString,
      key: 'start',
    };
  }

  const card: TargetModel = { id: '', type: 'Card' };
  try {
    const cardId = getObjectIdFromCacheObject(incoming, readField);
    card.id = cardId;

    syncNativeToRestScalars(
      card,
      scalarFieldMappings,
      incoming,
      cache,
      readField,
    );
    syncTrelloCardBadgesToCardBadges(card, incoming, cache, readField);

    // TODO: still need to sync label.idBoard
    syncListsOfModelRefs(card, nestedListMappings, incoming, cache, readField);

    syncCardDueInfo(card, incoming, cache, readField);
    syncCardLimits(card, incoming, cache, readField);
    syncCardCover(card, incoming, cache, readField);
    if (isCardBackCacheSyncingEnabled) {
      syncCardLocation(card, incoming, cache, readField);
      syncCardDescription(card, incoming, cache, readField);
    }

    // This syncing is for GQL queries that fetch the list and board through the card (card->list->board)
    // Queries & subscriptions that are board->list->card get synced in syncTrelloListToList & syncTrelloBoardToBoard
    const list = readField<TrelloList>('list', incoming);
    if (list) {
      const listId = getObjectIdFromCacheObject(list, readField);
      syncNestedModelReference(
        card,
        {
          model: { id: listId, type: 'List' },
          fieldName: 'list',
          idFieldName: 'idList',
        },
        cache,
      );

      const board = readField<TrelloBoard>('board', list);
      if (board) {
        const boardId = getObjectIdFromCacheObject(board, readField);
        syncNestedModelReference(
          card,
          {
            model: { id: boardId, type: 'Board' },
            fieldName: 'board',
            idFieldName: 'idBoard',
          },
          cache,
        );

        /**
         * We need to sync the references to the custom fields on the board because
         * the card selects a list of custom field items, each of which contains
         * a TrelloCustomField.
         *
         * If a board selects for customFields, then we'd be able to handle syncing
         * the custom field references to the board with syncListsOfModelRefs in
         * syncTrelloBoardToBoard.
         *
         * Syncing the custom field scalars is handled in syncTrelloCustomFieldToCustomField.
         *
         * We should also extract this functionality into a helper function to
         * get the nodes from a connection.
         *
         */
        const customFieldItemsConnection =
          readField<TrelloCustomFieldItemConnection>(
            'customFieldItems',
            incoming,
          );
        if (customFieldItemsConnection?.edges) {
          const customFields = customFieldItemsConnection.edges
            .map((edge) => {
              if (edge.node) {
                return edge.node;
              }
            })
            .map((customFieldItem) => {
              const customField = readField<TrelloCustomField>(
                'customField',
                customFieldItem,
              );
              if (customField) {
                // this can be a ref or a store object
                const id = getObjectIdFromCacheObject(customField, readField);
                return {
                  id,
                  type: 'CustomField',
                } as TargetModel;
              }
            })
            .filter((customField) => customField !== undefined);

          syncNestedModelListReferences(
            { id: boardId, type: 'Board' },
            {
              models: customFields.map((customField) => ({
                id: customField.id,
                type: 'CustomField',
              })),
              fieldName: 'customFields',
            },
            cache,
          );
        }
      }
    }
  } catch (err) {
    let error = err;
    if (err instanceof InvalidIdError || err instanceof MissingIdError) {
      if (err.typeName === 'TrelloList') {
        error = wrapIdErrorInParent(err, card, 'list');
      }
      if (err.typeName === 'TrelloBoard') {
        error = wrapIdErrorInParent(err, card, 'board');
      }
    }
    sendErrorEvent(error);
  }
};
