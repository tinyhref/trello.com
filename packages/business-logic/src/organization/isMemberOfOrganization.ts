import { getMembershipTypeFromOrganization } from './getMembershipTypeFromOrganization';

/**
 * Determine if the member is a member of the given organization. If
 * the org is an enterprise org, also pass in the enterprise in order
 * to check if the member is an enterprise admin.
 */
export const isMemberOfOrganization = (
  member: Parameters<typeof getMembershipTypeFromOrganization>[0],
  organization: Parameters<typeof getMembershipTypeFromOrganization>[1],
  enterprise?: Parameters<typeof getMembershipTypeFromOrganization>[2],
): boolean => {
  const memberType = getMembershipTypeFromOrganization(
    member,
    organization,
    enterprise,
  );
  if (memberType && ['admin', 'normal'].includes(memberType)) {
    return true;
  }
  return false;
};
