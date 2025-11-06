import { getMemberId } from '@trello/authentication';
import { sendErrorEvent } from '@trello/error-reporting';
import { TrelloStorage } from '@trello/storage';

import type { AccessibleProductsResponse } from './getAccessibleProducts';

const DAY_IN_MS = 86_400_000;
const getCacheKey = (): `accessibleProducts-${string}` =>
  `accessibleProducts-${getMemberId()}`;

export const getCachedAccessibleProducts: () =>
  | AccessibleProductsResponse['products']
  | null = () => {
  try {
    const accessibleProductsStorage = TrelloStorage.get(getCacheKey());
    if (accessibleProductsStorage) {
      if (typeof accessibleProductsStorage.expiration === 'number') {
        return accessibleProductsStorage.expiration >= Date.now()
          ? accessibleProductsStorage?.data?.products
          : null;
      } else {
        throw new Error('Unexpected localStorage timestamp type');
      }
    } else {
      return null;
    }
  } catch (error) {
    sendErrorEvent(error, {
      tags: {
        ownershipArea: 'trello-ghost',
        feature: 'Cross Flow Provider',
      },
    });
    return null;
  }
};

export const cacheAccessibleProducts = (data: AccessibleProductsResponse) => {
  // add a random amount (up to ~2.7 hours) to avoid cache stampede in the morning
  const TIMESTAMP_EXPIRATION_DURATION_IN_MS =
    DAY_IN_MS + Math.floor(Math.random() * 10_000_000);
  TrelloStorage.set(getCacheKey(), {
    expiration: Date.now() + TIMESTAMP_EXPIRATION_DURATION_IN_MS,
    data,
  });
};
