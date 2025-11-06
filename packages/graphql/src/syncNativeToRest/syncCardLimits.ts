import type { InMemoryCache, Reference } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import type {
  TrelloCard,
  TrelloCardLimit,
  TrelloCardLimits,
  TrelloLimitProps,
} from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { syncNativeNestedObjectToRest } from './syncNativeNestedObjectToRest';
import { isNumber, isString, nullOrNumber } from './validateHelpers';

type LimitType = Exclude<keyof TrelloCardLimits, '__typename'>;
type LimitName = Exclude<keyof TrelloLimitProps, '__typename'>;

const fieldMappings = {
  count: { validate: nullOrNumber },
  disableAt: { validate: isNumber },
  status: {
    validate: (val: unknown) =>
      isString(val) && ['ok', 'warn', 'disabled', 'maxExceeded'].includes(val),
  },
  warnAt: { validate: isNumber },
};

const generateCardLimitFragment = (
  limitType: LimitType,
  limitName: LimitName,
) => {
  return `fragment CardLimit${limitType}${limitName}Write on Card {
    id
    limits {
      ${limitType} {
        perCard {
          ${limitName}
        }
      }
    }
  }`;
};

const generateCardLimitData = (
  cardObjectId: string,
  limitType: LimitType,
  limitName: LimitName,
  limitValue: unknown,
) => {
  const limitTypenames = {
    attachments: 'Card_Limits_Attachments',
    checklists: 'Card_Limits_Checklists',
    stickers: 'Card_Limits_Stickers',
  };

  return {
    __typename: 'Card',
    id: cardObjectId,
    limits: {
      __typename: 'Card_Limits',
      [limitType]: {
        __typename: limitTypenames[limitType],
        perCard: {
          __typename: `${limitTypenames[limitType]}_PerCard`,
          [limitName]: limitValue,
        },
      },
    },
  };
};

/**
 * Given a native TrelloCard, syncs the card limits to the Card
 * model in the Apollo Cache
 * @param card The target Card model to write to
 * @param incoming The native TrelloCard data
 * @param cache The cache to write to
 * @param readField A function to read fields from cache references
 */
export const syncCardLimits = (
  card: TargetModel,
  incoming: RecursivePartial<TrelloCard> | Reference,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  const cardLimits = readField<TrelloCardLimits>('limits', incoming);
  if (!cardLimits) {
    return;
  }

  const cardLimitTypes: LimitType[] = ['attachments', 'checklists', 'stickers'];
  cardLimitTypes.forEach((limitType) => {
    const limit = readField<TrelloCardLimit>(limitType, cardLimits);
    if (!limit) {
      return;
    }

    const perCard = readField<TrelloLimitProps>('perCard', limit);
    if (!perCard) {
      return;
    }

    syncNativeNestedObjectToRest(
      card,
      fieldMappings,
      (field: string) =>
        generateCardLimitFragment(limitType, field as LimitName),
      (id: string, field: string, value: unknown) =>
        generateCardLimitData(id, limitType, field as LimitName, value),
      perCard,
      cache,
    );
  });
};
