import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { isPaidManagedEnterpriseMember } from '@trello/business-logic/member';
import { useDynamicConfig } from '@trello/dynamic-config';

import { useMemberEnterpriseFragment } from './MemberEnterpriseFragment.generated';

/**
 * This hook checks if planner has been disabled via dynamic config blocklist
 * for user with enterprise owned personal workspace.
 *
 * @returns {boolean} - true if the planner is disabled, false otherwise.
 */
export const useIsPlannerDisabled = () => {
  const memberId = useMemberId();
  const { data } = useMemberEnterpriseFragment({
    from: { id: memberId },
  });
  const { idEnterprise, confirmed, enterpriseLicenses } = data ?? {};

  const enterprisePlannerBlocklist = useDynamicConfig(
    'trello_enterprise_planner_blocklist',
  ) as Array<string>;

  const isLicensedManagedMember = useMemo(() => {
    return isPaidManagedEnterpriseMember({
      confirmed,
      idEnterprise,
      enterpriseLicenses,
    });
  }, [confirmed, enterpriseLicenses, idEnterprise]);

  const isPlannerDisabled = useMemo(() => {
    if (!idEnterprise) {
      return false;
    }
    if (!enterprisePlannerBlocklist?.length) {
      return false;
    }
    if (!enterprisePlannerBlocklist.includes(idEnterprise)) {
      return false;
    }
    return isLicensedManagedMember;
  }, [enterprisePlannerBlocklist, idEnterprise, isLicensedManagedMember]);

  return isPlannerDisabled;
};
