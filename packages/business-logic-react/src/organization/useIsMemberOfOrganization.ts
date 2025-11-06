import { useOrganizationMembershipType } from './useOrganizationMembershipType';

export interface UseIsMemberOfOrganizationConfig {
  idMember: string | null | undefined;
  idOrganization: string | null | undefined;
}

/**
 * Determine if the member is a member of the given organization. This hook also
 * checks if the member is an enterprise admin as they are considered a member
 * of all organizations within the enterprise.
 */
export const useIsMemberOfOrganization = ({
  idMember,
  idOrganization,
}: UseIsMemberOfOrganizationConfig) => {
  const membershipType = useOrganizationMembershipType({
    idMember,
    idOrganization,
  });

  if (!membershipType) {
    return false;
  }

  return ['admin', 'normal'].includes(membershipType);
};
