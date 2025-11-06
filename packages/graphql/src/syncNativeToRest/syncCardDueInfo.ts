import type { InMemoryCache, Reference } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import type { TrelloCard, TrelloCardDueInfo } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { syncNativeNestedObjectToRest } from './syncNativeNestedObjectToRest';
import { nullOrNumber, nullOrString } from './validateHelpers';

const fieldMappings = {
  at: {
    validate: nullOrString,
    key: 'due',
  },
  reminder: { validate: nullOrNumber, key: 'dueReminder' },
};

const generateCardDueFragment = (field: string) => {
  return `fragment Card${field}Write on Card {
    id
    ${field}
  }`;
};

const generateCardDueData = (id: string, field: string, value: unknown) => {
  return {
    __typename: 'Card',
    id,
    [field]: value,
  };
};

export const syncCardDueInfo = (
  card: TargetModel,
  incoming: RecursivePartial<TrelloCard> | Reference,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  let cardDueInfo = readField<TrelloCardDueInfo | null>('due', incoming);

  if (cardDueInfo === undefined) {
    return;
  }

  // If card.due is null, the we want all the nested properties to be set to null
  if (cardDueInfo === null) {
    cardDueInfo = {
      __typename: 'TrelloCardDueInfo',
      at: null,
      reminder: null,
    };
  }

  syncNativeNestedObjectToRest(
    card,
    fieldMappings,
    generateCardDueFragment,
    generateCardDueData,
    cardDueInfo,
    cache,
  );
};
