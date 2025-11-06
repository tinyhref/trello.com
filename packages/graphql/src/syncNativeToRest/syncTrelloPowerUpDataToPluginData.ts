import type { InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';

import type { TrelloPowerUpData } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncNativeToRestScalars } from './syncNativeToRestScalars';
import { isObjectId, isString } from './validateHelpers';

/**
 * Given a partial native TrelloPowerUpData object, writes all the data
 * to the corresponding PluginData model in the Apollo Cache
 * @param incoming A partial TrelloPowerUpData model
 * @param cache The cache to write to
 */
export const syncTrelloPowerUpDataToPluginData = (
  incoming: RecursivePartial<TrelloPowerUpData>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  try {
    const powerUpDataId = getObjectIdFromCacheObject(incoming, readField);
    const powerUpData: TargetModel = { type: 'PluginData', id: powerUpDataId };

    const fieldMappings = {
      powerUp: {
        fetchValue: (data: RecursivePartial<TrelloPowerUpData>) => {
          const powerUp = readField<TrelloPowerUpData['powerUp']>(
            'powerUp',
            data,
          );
          return powerUp
            ? getObjectIdFromCacheObject(powerUp, readField)
            : powerUp;
        },
        validate: isObjectId,
        key: 'idPlugin',
        sendValueToSentry: true,
      },
      value: { validate: isString },
    };

    syncNativeToRestScalars<TrelloPowerUpData>(
      powerUpData,
      fieldMappings,
      incoming,
      cache,
      readField,
    );
  } catch (err) {
    sendErrorEvent(err);
  }
};
