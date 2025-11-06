import type { Organization } from '@trello/model-types';

export type LimitStatus = 'disabled' | 'maxExceeded' | 'ok' | 'warn';
interface OrganizationLimits {
  orgs?: {
    freeBoardsPerOrg?: {
      count?: number | null;
      disableAt?: number | null;
      warnAt?: number | null;
      status?: LimitStatus | null;
    } | null;
  } | null;
}

/**
 * Checks if there are limits on the number of free boards the organization can create.
 */
export const hasFreeBoardLimitDefined = <
  TInputOrganization extends {
    limits?: OrganizationLimits | null;
  },
  TInputOrganizationWithLimits extends {
    limits: Organization['limits'];
  },
>(
  organization: TInputOrganization | TInputOrganizationWithLimits,
): organization is TInputOrganizationWithLimits => {
  return !!organization?.limits?.orgs?.freeBoardsPerOrg;
};
