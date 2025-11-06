import type { Enterprise, Member, Organization } from '@trello/model-types';

/**
 * Determine if a given member can admin a given Enterprise
 * @param enterpriseId The id of the Enterprise to check
 */
const canMemberAdminEnterprise = (
  member: {
    idEnterprisesAdmin?: string[] | null;
    idEnterprisesImplicitAdmin?: string[] | null;
  },
  enterpriseId: string,
): boolean => {
  const idEnterprisesAdmin = member.idEnterprisesAdmin || [];
  const idEnterprisesImplicitAdmin = member.idEnterprisesImplicitAdmin || [];

  // The unique set of Enterprise ID's that this member can act as an
  // Enterprise Admin for (either explicitly or implicitly)
  const memberAdminEnterprisesId = [
    ...new Set([...idEnterprisesAdmin, ...idEnterprisesImplicitAdmin]),
  ];

  return memberAdminEnterprisesId.includes(enterpriseId);
};

/**
 * Get the type of membership a user has in relation to a given
 * organization. If the org is an Enterprise org, also need to pass
 * in the enterprise.
 */
export const getMembershipTypeFromOrganization = (
  member: {
    id: string;
    idPremOrgsAdmin?: string[] | null;
    idEnterprisesAdmin?: string[] | null;
    idEnterprisesImplicitAdmin?: string[] | null;
    memberType: Member['memberType'];
  },
  organization: Pick<Organization, 'id' | 'offering'> & {
    idEnterprise?: string | null;
    memberships: Pick<
      Organization['memberships'][number],
      'deactivated' | 'idMember' | 'memberType' | 'unconfirmed'
    >[];
  },
  enterprise?: {
    id?: Organization['enterprise']['id'];
    idAdmins?: Organization['enterprise']['idAdmins'];
  } | null,
):
  | 'admin'
  | 'deactivated'
  | 'guest'
  | 'normal'
  | 'pending'
  | 'unconfirmed'
  | null => {
  const { idPremOrgsAdmin = [] } = member;
  const { memberships = [] } = organization;
  const { id: enterpriseId, idAdmins = [] } = enterprise || ({} as Enterprise);

  // Bad data, enterprise and organization are not related. Abort
  if (enterpriseId && organization?.idEnterprise !== enterpriseId) {
    return null;
  }

  /*
   * Is this user even real? If the user is a "ghost" ie. stub user
   * created by an invitation, return "pending"
   */
  if (member.memberType === 'ghost') {
    return 'pending';
  }

  /*
   * Is this an Enterprise org? If so:
   * 1. Check that the org is enterprise owned (enterpriseId on the org and enterprise should match)
   * 2. Check if the enterprise's idAdmins field contains the member
   * 3. Check if the member's idEnterprisesAdmin field includes the enterprise
   *
   * Enterprise admins are automatically admins of all Enterprise orgs,
   * regardless of what the org's membership collection says.
   */
  if (
    organization.idEnterprise &&
    // Passed enterprise owns the organization
    (enterpriseId === organization.idEnterprise ||
      // No passed enterprise, but idEnterprise present on the organization
      !enterpriseId)
  ) {
    const enterpriseIdToCheck = enterpriseId || organization.idEnterprise;

    if (
      idAdmins?.includes(member.id) ||
      canMemberAdminEnterprise(member, enterpriseIdToCheck)
    ) {
      return 'admin';
    }
  }

  /*
   * Does the provided Member object contain an `idPremOrgsAdmin` array?
   * If so, check to see if it includes this org's id. If so, that's
   * sufficient to say the user is an admin.
   */
  if (idPremOrgsAdmin?.includes(organization.id)) {
    return 'admin';
  }

  /*
   * If we've gotten this far, check the memberships collection on the
   * org for a membership with the member's id. It will be either "admin"
   * or "normal", but we also want to check if the member is unconfirmed
   * or deactivated first.
   */
  const membership = memberships?.find((m) => m.idMember === member.id);
  if (membership) {
    if (membership.deactivated) {
      return 'deactivated';
    } else if (membership.unconfirmed) {
      return 'unconfirmed';
    }
    return membership.memberType;
  }

  /*
   * Looks like this user is not a member of this org at all.
   */
  return null;
};
