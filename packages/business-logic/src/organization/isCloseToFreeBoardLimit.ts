import type { LimitStatus } from '@trello/model-types';

import { freeBoardsRemaining } from './freeBoardsRemaining';
import { hasFreeBoardLimitDefined } from './hasFreeBoardLimitDefined';

/**
 * Checks if the organization is close to reaching its free boards limit.
 */
export const isCloseToFreeBoardLimit = (organization: {
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

  if (!hasFreeBoardLimitDefined(organization) || remaining === undefined) {
    return remaining !== undefined && remaining <= 7;
  }

  const { disableAt, warnAt } = organization.limits.orgs.freeBoardsPerOrg;

  return remaining <= disableAt - (warnAt ?? 0);
};
