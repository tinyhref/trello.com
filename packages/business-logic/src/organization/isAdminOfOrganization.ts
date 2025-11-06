import { getMembershipTypeFromOrganization } from './getMembershipTypeFromOrganization';

/**
 * Determine if the member is an admin of the given organization. If
 * the org is an enterprise org, also pass in the enterprise in order
 * to check if the member is an enterprise admin.
 */
export const isAdminOfOrganization = (
  ...args: Parameters<typeof getMembershipTypeFromOrganization>
): boolean => getMembershipTypeFromOrganization(...args) === 'admin';
