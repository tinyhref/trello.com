import type { InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import type { TrelloCard, TrelloUserGeneratedText } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { syncNativeNestedObjectToRest } from './syncNativeNestedObjectToRest';
import { nullOrString } from './validateHelpers';

const fieldMappings = {
  text: { validate: nullOrString, key: 'desc' },
};

const generateCardDescriptionFragment = (field: string) => {
  return `fragment Card${field}Write on Card {
    id
    ${field}
  }`;
};

const generateCardDescriptionData = (
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

/**
 * Syncs description data from a TrelloCard to a Card in the Apollo cache
 * @param card - The target Card model to sync to
 * @param incoming - The source TrelloCard or Reference containing description data
 * @param cache - The Apollo InMemoryCache instance
 * @param readField - Apollo cache read field function
 */
export const syncCardDescription = (
  card: TargetModel,
  incoming: RecursivePartial<TrelloCard>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  const cardDescription = readField<TrelloUserGeneratedText | null>(
    'description',
    incoming,
  );

  if (cardDescription === undefined) {
    return;
  }

  syncNativeNestedObjectToRest(
    card,
    fieldMappings,
    generateCardDescriptionFragment,
    generateCardDescriptionData,
    cardDescription,
    cache,
  );
};
