import type { Organization } from '@trello/model-types';

import { getPaidStatus } from '../organization/getPaidStatus';

/**
 * Returns member's maximum subscription status from the list of their organizations according to the following ranking: free: 0, standard: 1, bc: 2, enterprise: 3.
 */
export const getMaxPaidStatus = (
  memberOrgs: Pick<Organization, 'offering'>[],
) => {
  const paidStatusRankings = {
    free: 0,
    standard: 1,
    bc: 2,
    enterprise: 3,
  } as const;
  const maxOrgPaidStatus = memberOrgs.reduce(
    (maxPaidStatus, { offering }) => {
      const paidStatus = getPaidStatus(offering);
      if (paidStatusRankings[paidStatus] > paidStatusRankings[maxPaidStatus])
        maxPaidStatus = paidStatus;
      return maxPaidStatus;
    },
    <'bc' | 'enterprise' | 'free' | 'standard'>'free',
  );

  return maxOrgPaidStatus;
};
