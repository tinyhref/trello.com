import type { LimitStatus } from '@trello/model-types';

import { freeBoardsRemaining } from './freeBoardsRemaining';

/**
 * Checks if the organization has reached or exceeded its free boards limit.
 */
export const isAtOrOverFreeBoardLimit = (organization: {
  limits?: {
    orgs?: {
      freeBoardsPerOrg?: {
        count?: number | null;
        disableAt?: number | null;
        warnAt?: number | null;
        status?: LimitStatus | null;
      } | null;
    } | null;
  } | null;
}): boolean => {
  const remaining = freeBoardsRemaining(organization);

  return remaining === 0;
};
