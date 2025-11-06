import { useMemo } from 'react';

import { Entitlements } from '@trello/entitlements';

import type { MemberOrganizationsFragment } from './MemberOrganizationsFragment.generated';
import type { MemberOrganizationsQuery } from './MemberOrganizationsQuery.generated';

export const useOwnedBillablePremiumOrganizations = (
  member:
    | MemberOrganizationsFragment
    | MemberOrganizationsQuery['member']
    | undefined,
) => {
  // Get the list of billable premium organizations for this member
  const billablePremiumOrganizations = useMemo(() => {
    const membersOrganizations = member?.organizations;
    const ownedOrgs = member?.idPremOrgsAdmin;

    if (!ownedOrgs || !membersOrganizations) {
      return [];
    }

    return membersOrganizations.filter((organization) => {
      const offering = organization.offering;
      const premiumFeatures = organization.premiumFeatures ?? [];

      return (
        // Premium offering
        Entitlements.isPremium(offering) &&
        // Externally billed
        premiumFeatures.includes('externallyBilled') &&
        // Member is an admin
        ownedOrgs.includes(organization.id)
      );
    });
  }, [member?.idPremOrgsAdmin, member?.organizations]);

  return billablePremiumOrganizations;
};
