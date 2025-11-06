import type { getMembershipTypeFromOrganization } from '@trello/business-logic/organization';

import { useOrganizationMembershipType } from './useOrganizationMembershipType';

/**
 * Will return a boolean specifying whether the given member has
 * the expected memberType in relation to the organization
 */
export const useIsOrganizationMembershipType = ({
  idMember,
  idOrganization,
  expectedMemberType,
}: {
  idMember: string | null | undefined;
  idOrganization: string | null | undefined;
  expectedMemberType: ReturnType<typeof getMembershipTypeFromOrganization>;
}) => {
  const memberType = useOrganizationMembershipType({
    idMember,
    idOrganization,
  });

  return memberType === expectedMemberType;
};
