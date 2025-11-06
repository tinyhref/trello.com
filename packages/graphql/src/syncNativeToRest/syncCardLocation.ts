import type { InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import type {
  TrelloCard,
  TrelloCardCoordinates,
  TrelloCardLocation,
} from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { syncNativeNestedObjectToRest } from './syncNativeNestedObjectToRest';
import { isNumber, nullOrString } from './validateHelpers';

const fieldMappings = {
  address: { validate: nullOrString },
  name: { validate: nullOrString, key: 'locationName' },
  staticMapUrl: { validate: nullOrString },
};

const coordinatesFieldMappings = {
  latitude: { validate: isNumber },
  longitude: { validate: isNumber },
};

const generateCardLocationFragment = (field: string) => {
  return `fragment Card${field}Write on Card {
    id
    ${field}
  }`;
};

const generateCardLocationData = (
  id: string,
  field: string,
  value: unknown,
) => {
  return {
    __typename: 'Card',
    id,
    [field]: value,
  };
};

const generateCardCoordinatesFragment = (field: string) => {
  return `fragment Card${field}Write on Card {
    id
    coordinates {
      ${field}
    }
  }`;
};

const generateCardCoordinatesData = (
  id: string,
  field: string,
  value: unknown,
) => {
  return {
    __typename: 'Card',
    id,
    coordinates: { [field]: value },
  };
};

/**
 * Syncs location data from a TrelloCard to a Card in the Apollo cache
 * @param card - The target Card model to sync to
 * @param incoming - The source TrelloCard or Reference containing location data
 * @param cache - The Apollo InMemoryCache instance
 * @param readField - Apollo cache read field function
 */
export const syncCardLocation = (
  card: TargetModel,
  incoming: RecursivePartial<TrelloCard>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  let cardLocation = readField<TrelloCardLocation | null>('location', incoming);

  if (cardLocation === undefined) {
    return;
  }

  // If card.location is null then it is not set on the card, set the following properties as they appear
  // on a card without a location.
  if (cardLocation === null) {
    cardLocation = {
      __typename: 'TrelloCardLocation',
      address: '',
      name: '',
      staticMapUrl: null,
    };

    // sync the Card.coordinates field to null
    syncNativeNestedObjectToRest(
      card,
      {
        coordinates: { validate: (v) => v === null },
      },
      generateCardLocationFragment,
      generateCardLocationData,
      {
        __typename: 'TrelloCardLocation',
        coordinates: null,
      },
      cache,
    );
  }

  syncNativeNestedObjectToRest(
    card,
    fieldMappings,
    generateCardLocationFragment,
    generateCardLocationData,
    cardLocation,
    cache,
  );

  const coordinates = readField<TrelloCardCoordinates | null>(
    'coordinates',
    cardLocation,
  );

  // we already handled the case where coordinates is null
  if (!coordinates) {
    return;
  }

  syncNativeNestedObjectToRest(
    card,
    coordinatesFieldMappings,
    generateCardCoordinatesFragment,
    generateCardCoordinatesData,
    coordinates,
    cache,
  );
};
