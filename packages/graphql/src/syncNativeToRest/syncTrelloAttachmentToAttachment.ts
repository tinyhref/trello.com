import type { InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';
import { dangerouslyGetFeatureGateSync } from '@trello/feature-gate-client';

import type { TrelloImagePreviewEdge } from '../generated';
import {
  type TrelloAttachment,
  type TrelloImagePreviewConnection,
} from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncNativeNestedObjectArray } from './syncNativeNestedObjectArray';
import { syncNativeToRestScalars } from './syncNativeToRestScalars';
import {
  isBool,
  isNumber,
  isObjectId,
  isString,
  nullOrNumber,
  nullOrString,
} from './validateHelpers';

export const scalarFieldMappings = {
  isMalicious: { validate: isBool },
};

export const cardBackScalarFieldMappings = {
  bytes: { validate: nullOrNumber },
  creatorId: { validate: isObjectId, key: 'idMember' },
  date: { validate: isString },
  edgeColor: { validate: nullOrString },
  fileName: { validate: isString },
  isUpload: { validate: isBool },
  mimeType: { validate: nullOrString },
  name: { validate: isString },
  position: { validate: isNumber, key: 'pos' },
  url: { validate: isString },
};

export const previewsFieldMappings = {
  bytes: { validate: isNumber },
  height: { validate: isNumber },
  objectId: { validate: isObjectId, key: '_id' },
  scaled: { validate: isBool },
  url: { validate: isString },
  width: { validate: isNumber },
};

const generateAttachmentPreviewsFragment = () => {
  return `fragment AttachmentPreviewsWrite on Attachment {
    previews
  }`;
};

const generateAttachmentPreviewsData = (id: string, value: unknown) => {
  return {
    __typename: 'Attachment',
    id,
    previews: Array.isArray(value)
      ? value.map((obj) => ({
          ...obj,
          __typename: 'Attachment_Preview',
        }))
      : value,
  };
};

/**
 * Given native TrelloAttachment data, writes all attachment data to the Attachment model
 * in the Apollo Cache
 * @param incoming A partial TrelloAttachment model
 * @param cache The cache to write to
 */
export const syncTrelloAttachmentToAttachment = (
  incoming: RecursivePartial<TrelloAttachment>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  const isCardBackCacheSyncingEnabled = dangerouslyGetFeatureGateSync(
    'goo_card_back_cache_syncing',
  );
  const fieldMappings = isCardBackCacheSyncingEnabled
    ? {
        ...scalarFieldMappings,
        ...cardBackScalarFieldMappings,
      }
    : scalarFieldMappings;

  try {
    const attachmentId = getObjectIdFromCacheObject(incoming, readField);
    const attachment: TargetModel = { type: 'Attachment', id: attachmentId };
    syncNativeToRestScalars(
      attachment,
      fieldMappings,
      incoming,
      cache,
      readField,
    );

    if (isCardBackCacheSyncingEnabled) {
      const previewConnection = readField<TrelloAttachment['previews']>(
        'previews',
        incoming,
      );
      const previewEdges =
        previewConnection &&
        readField<TrelloImagePreviewConnection['edges']>(
          'edges',
          previewConnection,
        );
      const previewNodes = (previewEdges ?? [])
        .map((edge) => readField<TrelloImagePreviewEdge['node']>('node', edge))
        .filter((node) => node !== undefined);
      syncNativeNestedObjectArray(
        attachment,
        previewsFieldMappings,
        generateAttachmentPreviewsFragment,
        generateAttachmentPreviewsData,
        previewNodes,
        cache,
        {
          shouldMapNullArrayItem: false,
        },
      );
    }
  } catch (err) {
    sendErrorEvent(err);
  }
};
