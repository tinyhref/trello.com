import { getMembershipTypeFromOrganization } from '@trello/business-logic/organization';

import { useMemberOrganizationMembershipsFragment } from './MemberOrganizationMembershipsFragment.generated';
import { useOrganizationMembershipsFragment } from './OrganizationMembershipsFragment.generated';
/**
 * Will return the member type in relation to the organization based on the member's
 * memberType, their enterprise status, and the organization memberships.
 */
export const useOrganizationMembershipType = ({
  idMember,
  idOrganization,
}: {
  idMember: string | null | undefined;
  idOrganization: string | null | undefined;
}) => {
  const { data: member } = useMemberOrganizationMembershipsFragment({
    from: { id: idMember || null },
  });

  const { data: organization } = useOrganizationMembershipsFragment({
    from: { id: idOrganization || null },
  });

  if (!member || !organization) {
    return null;
  }

  return getMembershipTypeFromOrganization(
    member,
    organization,
    organization?.enterprise,
  );
};
