import type { InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';

import type { TrelloSticker } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncNativeNestedObjectArray } from './syncNativeNestedObjectArray';
import { syncNativeToRestScalars } from './syncNativeToRestScalars';
import {
  isNumber,
  isObjectId,
  isString,
  nullOrBool,
  nullOrNumber,
} from './validateHelpers';

/** Exported for testing only! */
export const scalarFieldMappings = {
  top: { validate: isNumber },
  left: { validate: isNumber },
  zIndex: { validate: isNumber },
  rotate: { validate: isNumber },
  image: { validate: isString },
  url: { validate: isString, key: 'imageUrl' },
};

const imageScaledFieldMappings = {
  height: { validate: isNumber },
  width: { validate: isNumber },
  url: { validate: isString },
  objectId: {
    validate: (val: unknown) => val === null || isObjectId(val),
    key: 'id',
    sendValueToSentry: true,
  },
  bytes: { validate: nullOrNumber },
  scaled: { validate: nullOrBool },
};

const generateStickerImageScaledFragment = () => {
  return `fragment StickerImageScaledWrite on Sticker {
    imageScaled
  }`;
};

const generateStickerImageScaledData = (id: string, value: unknown) => {
  return {
    __typename: 'Sticker',
    id,
    imageScaled: Array.isArray(value)
      ? value.map((obj) => ({
          ...obj,
          __typename: 'Sticker_ImageScaled',
        }))
      : value,
  };
};

/**
 * Given native TrelloSticker data, writes all sticker data to the
 * Sticker model in the Apollo Cache
 * @param incoming A partial TrelloSticker model
 * @param cache The cache to write to
 * @param readField A function to read fields from cache references
 */
export const syncTrelloStickerToSticker = (
  incoming: RecursivePartial<TrelloSticker>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  try {
    const stickerId = getObjectIdFromCacheObject(incoming, readField);
    const sticker: TargetModel = { type: 'Sticker', id: stickerId };
    syncNativeToRestScalars(
      sticker,
      scalarFieldMappings,
      incoming,
      cache,
      readField,
    );

    const imageScaled = readField<TrelloSticker['imageScaled']>(
      'imageScaled',
      incoming,
    );

    syncNativeNestedObjectArray(
      sticker,
      imageScaledFieldMappings,
      generateStickerImageScaledFragment,
      generateStickerImageScaledData,
      imageScaled,
      cache,
      {
        shouldMapNullFieldToNull: false, // imageScaled is a non-nullable array
        shouldMapNullArrayItem: false, // objects inside the imageScaled array are non-nullable
      },
    );
  } catch (err) {
    sendErrorEvent(err);
  }
};
