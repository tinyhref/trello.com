import { Entitlements } from '@trello/entitlements';
import type { LimitStatus } from '@trello/model-types';

import { hasFreeBoardLimitDefined } from './hasFreeBoardLimitDefined';

/**
 * Returns the number of free boards that the organization has exceeded the limit by.
 */
export const freeBoardsOver = (organization: {
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
  offering?: string | null;
}): number => {
  if (
    (organization.offering && !Entitlements.isFree(organization.offering)) ||
    !hasFreeBoardLimitDefined(organization)
  ) {
    return 0;
  }

  const limit = organization.limits.orgs.freeBoardsPerOrg;
  if (limit.count === undefined) {
    return 0;
  }

  const delta = limit.disableAt - (limit.count ?? 0);

  return delta < 0 ? Math.abs(delta) : 0;
};
