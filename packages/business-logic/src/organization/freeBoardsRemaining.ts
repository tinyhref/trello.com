import { Entitlements } from '@trello/entitlements';
import type { LimitStatus } from '@trello/model-types';

import { hasFreeBoardLimitDefined } from './hasFreeBoardLimitDefined';

/**
 * Returns the number of boards the organization can create within the limit of available free boards.
 */
export const freeBoardsRemaining = (organization: {
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
}): number | undefined => {
  if (
    (organization.offering && !Entitlements.isFree(organization.offering)) ||
    !hasFreeBoardLimitDefined(organization)
  ) {
    return undefined;
  }

  const limit = organization.limits.orgs.freeBoardsPerOrg;
  if (limit.count === undefined) {
    return undefined;
  }

  const delta = limit.disableAt - (limit.count ?? 0);

  return delta < 0 ? 0 : delta;
};
