import type { InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';

import type { TrelloLabel } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncNativeToRestScalars } from './syncNativeToRestScalars';
import { isEnumString, isString } from './validateHelpers';

const validLabelColors = [
  'black',
  'black_dark',
  'black_light',
  'blue',
  'blue_dark',
  'blue_light',
  'green',
  'green_dark',
  'green_light',
  'lime',
  'lime_dark',
  'lime_light',
  'orange',
  'orange_dark',
  'orange_light',
  'pink',
  'pink_dark',
  'pink_light',
  'purple',
  'purple_dark',
  'purple_light',
  'red',
  'red_dark',
  'red_light',
  'sky',
  'sky_dark',
  'sky_light',
  'yellow',
  'yellow_dark',
  'yellow_light',
];

export const fieldMappings = {
  color: {
    validate: (value: unknown) =>
      value === null || isEnumString(value, validLabelColors),
    sendValueToSentry: true,
  },
  name: { validate: isString },
};

/**
 * Given native TrelloLabel data, writes all label data to the Label model
 * in the Apollo Cache
 * @param incoming A partial TrelloLabel model
 * @param cache The cache to write to
 */
export const syncTrelloLabelToLabel = (
  incoming: RecursivePartial<TrelloLabel>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  try {
    const labelId = getObjectIdFromCacheObject(incoming, readField);
    const label: TargetModel = { type: 'Label', id: labelId };
    syncNativeToRestScalars(label, fieldMappings, incoming, cache, readField);
  } catch (err) {
    sendErrorEvent(err);
  }
};
