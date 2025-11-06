import type { InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';

import type { TrelloBoardPowerUpEdge } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncNativeToRestScalars } from './syncNativeToRestScalars';
import { isObjectId } from './validateHelpers';

const fieldMappings = {
  objectId: {
    validate: isObjectId,
    key: 'idPlugin',
    sendValueToSentry: true,
  },
};

/**
 * Given a partial native TrelloBoardPowerUpEdge object, writes all the data
 * to the corresponding BoardPlugin model in the Apollo Cache
 * @param incoming A partial TrelloBoardPowerUpEdge model
 * @param cache The cache to write to
 * @param readField A function to read fields from cache references
 */
export const syncTrelloPowerUpToBoardPlugins = (
  incoming: RecursivePartial<TrelloBoardPowerUpEdge>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  try {
    const boardPluginId = getObjectIdFromCacheObject(incoming, readField);
    const targetModel: TargetModel = { type: 'BoardPlugin', id: boardPluginId };
    const node = readField<TrelloBoardPowerUpEdge['node']>('node', incoming);

    if (!node) {
      return;
    }

    syncNativeToRestScalars(targetModel, fieldMappings, node, cache, readField);
  } catch (err) {
    sendErrorEvent(err);
  }
};
