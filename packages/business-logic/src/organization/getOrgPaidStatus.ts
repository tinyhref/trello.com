import { Entitlements } from '@trello/entitlements';
import type { Organization } from '@trello/model-types';

import { getFreeTrialProperties } from './getFreeTrialProperties';

type PaidStatus = 'BUS' | 'ENT' | 'FREE_TRIAL' | 'FREE' | 'UNKNOWN';

/**
 * Returns paid status of the organization.
 */
export function getOrgPaidStatus(
  org?:
    | (Pick<Organization, 'id' | 'name' | 'offering'> & {
        idEnterprise?: string | null;
        paidAccount?: {
          trialExpiration?:
            | Organization['paidAccount']['trialExpiration']
            | null;
        } | null;
        credits?:
          | {
              id: string;
              type: Organization['credits'][number]['type'];
              count: Organization['credits'][number]['count'];
            }[]
          | null;
      })
    | null,
): PaidStatus {
  const credits = org?.credits || [];
  const orgName = org?.name;
  const offering = org?.offering ?? '';

  const isEnterprise = Entitlements.isEnterprise(offering);
  const isPremium = Entitlements.isPremium(offering);
  const isFreeTrial = Boolean(
    getFreeTrialProperties(
      credits,
      offering,
      org?.paidAccount?.trialExpiration || '',
    )?.isActive,
  );
  //if we have access to the orgName, we know that the org is readable by the user
  const isFree = !isEnterprise && !isPremium && orgName;

  if (isEnterprise) {
    return 'ENT';
  } else if (isPremium) {
    return isFreeTrial ? 'FREE_TRIAL' : 'BUS';
  } else if (isFree) {
    return 'FREE';
  } else {
    return 'UNKNOWN';
  }
}
