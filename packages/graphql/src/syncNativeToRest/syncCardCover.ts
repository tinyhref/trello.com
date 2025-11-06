import type { InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import type {
  TrelloImagePreviewConnection,
  TrelloImagePreviewEdge,
} from '../generated';
import { type TrelloCard, type TrelloCardCover } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncNativeNestedObjectArray } from './syncNativeNestedObjectArray';
import { syncNativeNestedObjectToRest } from './syncNativeNestedObjectToRest';
import { syncNativeToRestScalars } from './syncNativeToRestScalars';
import {
  isBool,
  isEnumString,
  isNumber,
  isObjectId,
  isString,
  nullOrString,
} from './validateHelpers';

const coverColors = [
  'BLACK',
  'BLUE',
  'GREEN',
  'LIME',
  'ORANGE',
  'PINK',
  'PURPLE',
  'RED',
  'SKY',
  'YELLOW',
];

const generateCardCoverFragment = (field: string) => {
  return `fragment CardCover${field}Write on Card {
    id
    cover {
      ${field}
    }
  }`;
};

const generateCardCoverData = (id: string, field: string, value: unknown) => {
  return {
    __typename: 'Card',
    id,
    cover: {
      __typename: 'Card_Cover',
      [field]: value,
    },
  };
};

// Really annoyingly, even though both TrelloSticker.imageScaled
// and TrelloCardCover.previews have the same native type (TrelloImagePreview),
// they have different non-native types so we can't reuse the mappings
const previewsMappings = {
  height: { validate: isNumber },
  width: { validate: isNumber },
  url: { validate: isString },
  bytes: { validate: isNumber },
  scaled: { validate: isBool },
  // Even though ID is non-nullable, this array is nested inside a non-normalized object
  // So we can't use syncListsOfModelRefs
  objectId: { validate: isObjectId, key: 'id' },
};

const generateCardCoverPreviewsFragment = () => {
  return `fragment CardCoverPreviewsWrite on Card {
    id
    cover {
      scaled
    }
  }`;
};

const generateCardCoverPreviewsData = (id: string, value: unknown) => {
  return {
    __typename: 'Card',
    id,
    cover: {
      __typename: 'Card_Cover',
      scaled: Array.isArray(value)
        ? value.map((obj) => ({
            ...obj,
            __typename: 'Card_Cover_Scaled',
          }))
        : value,
    },
  };
};

/**
 * Given a native TrelloCard, syncs the card cover to the Card
 * model in the Apollo Cache
 * @param card The target Card model to write to
 * @param incoming The native TrelloCard data
 * @param cache The cache to write to
 * @param readField A function to read fields from cache references
 */
export const syncCardCover = (
  card: TargetModel,
  incoming: RecursivePartial<TrelloCard>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  const cardCover = readField<TrelloCardCover | null>('cover', incoming);

  if (cardCover === undefined) {
    return;
  }

  const getCoverAttachmentId = () => {
    if (!cardCover) {
      return null;
    }
    const attachment = readField<TrelloCardCover['attachment']>(
      'attachment',
      cardCover,
    );
    return attachment
      ? getObjectIdFromCacheObject(attachment, readField)
      : attachment;
  };

  // Sync Card.idAttachmentCover field (same value as Card.cover.idAttachment)
  syncNativeToRestScalars(
    card,
    {
      cover: {
        key: 'idAttachmentCover',
        fetchValue: getCoverAttachmentId,
        validate: nullOrString,
      },
    },
    incoming,
    cache,
    readField,
  );

  if (cardCover === null) {
    // Technically both Card.cover and TrelloCard.cover are nullable,
    // so we allow this. In reality though, this should never happen because
    // even a card with no cover has cover.brightness and cover.size set
    syncNativeToRestScalars(
      card,
      { cover: { validate: (val: unknown) => val === null } },
      incoming,
      cache,
      readField,
    );
    return;
  }

  const fieldMappings = {
    attachment: {
      fetchValue: getCoverAttachmentId,
      key: 'idAttachment',
      validate: nullOrString,
    },
    powerUp: {
      fetchValue: (data: RecursivePartial<TrelloCardCover>) => {
        const powerUp = readField<TrelloCardCover['powerUp']>('powerUp', data);
        return powerUp
          ? getObjectIdFromCacheObject(powerUp, readField)
          : powerUp;
      },
      key: 'idPlugin',
      validate: nullOrString,
    },
    uploadedBackground: {
      fetchValue: (data: RecursivePartial<TrelloCardCover>) => {
        const uploadedBackground = readField<
          TrelloCardCover['uploadedBackground']
        >('uploadedBackground', data);
        return uploadedBackground
          ? getObjectIdFromCacheObject(uploadedBackground, readField)
          : uploadedBackground;
      },
      key: 'idUploadedBackground',
      validate: nullOrString,
    },
    brightness: {
      validate: (val: unknown) =>
        val === null || isEnumString(val, ['DARK', 'LIGHT']),
      transform: (val: string | null) =>
        isString(val) ? val.toLowerCase() : val,
    },
    color: {
      validate: (val: unknown) =>
        val === null || isEnumString(val, coverColors),
      transform: (val: string | null) =>
        isString(val) ? val.toLowerCase() : val,
    },
    edgeColor: {
      validate: nullOrString,
    },
    size: {
      validate: (val: unknown) =>
        val === null || isEnumString(val, ['FULL', 'NORMAL']),
      transform: (val: string | null) =>
        isString(val) ? val.toLowerCase() : val,
    },
    sharedSourceUrl: {
      validate: nullOrString,
    },
  };

  syncNativeNestedObjectToRest(
    card,
    fieldMappings,
    generateCardCoverFragment,
    generateCardCoverData,
    cardCover,
    cache,
  );

  const previewConnection = readField<TrelloCardCover['previews']>(
    'previews',
    cardCover,
  );

  if (previewConnection === undefined) {
    return;
  }

  // It is valid for Card_Cover.scaled to be set to null,
  // so if TrelloCardCover.previews is null then we don't immediately return
  let previews = null;
  if (previewConnection) {
    const previewEdges = readField<TrelloImagePreviewConnection['edges']>(
      'edges',
      previewConnection,
    );
    if (previewEdges) {
      previews = previewEdges
        .map((edge) =>
          edge ? readField<TrelloImagePreviewEdge['node']>('node', edge) : null,
        )
        .filter((node) => node !== undefined);
    }
  }

  syncNativeNestedObjectArray(
    card,
    previewsMappings,
    generateCardCoverPreviewsFragment,
    generateCardCoverPreviewsData,
    previews,
    cache,
    {
      shouldMapNullFieldToNull: true, // Card_Cover.scaled is nullable
      shouldMapNullArrayItem: false, // but objects inside it are not
    },
  );
};
