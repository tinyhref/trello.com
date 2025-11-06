type AddMembershipErrorType =
  | 'added'
  | 'deactivated-in-the-enterprise'
  | 'existing'
  | 'member-too-many-orgs'
  | 'member-unconfirmed'
  | 'must-reactivate'
  | 'no-enterprise-licenses'
  | 'not-in-enterprise'
  | 'not-managed-ent-member-or-valid-email'
  | 'not-managed-ent-member'
  | 'rate-limit-exceeded'
  | 'restricted'
  | 'too-many-members'
  | 'unauthorized-licensed-invite'
  | 'unknown'
  | 'username-not-found';

export const CATEGORIES: Record<string, AddMembershipErrorType> = {
  RESTRICTED: 'restricted',
  MUST_REACTIVATE: 'must-reactivate',
  USERNAME_NOT_FOUND: 'username-not-found',
  NOT_IN_ENTERPRISE: 'not-in-enterprise',
  NO_ENTERPRISE_LICENSES: 'no-enterprise-licenses',
  RATE_LIMIT: 'rate-limit-exceeded',
  UNKNOWN: 'unknown',
  EXISTING: 'existing',
  ADDED: 'added',
  TOO_MANY_MEMBERS: 'too-many-members',
  MEMBER_TOO_MANY_ORGS: 'member-too-many-orgs',
  DEACTIVATED_IN_THE_ENTERPRISE: 'deactivated-in-the-enterprise',
  MUST_BE_MANAGED_ENT_MEMBER_OR_VALID_EMAIL:
    'not-managed-ent-member-or-valid-email',
  MUST_BE_MANAGED_ENT_MEMBER: 'not-managed-ent-member',
  MEMBERSHIPS_TOO_MANY_UNCONFIRMED_INVITATIONS: 'member-unconfirmed',
  UNAUTHORIZED_LICENSED_INVITE: 'unauthorized-licensed-invite',
};

/**
 * This function was extracted from the error handling logic in `addMembers` on the organization model.
 */
export const getAddMembershipErrorType: (
  errorMessage: string,
) => AddMembershipErrorType = (errorMessage: string) => {
  if (/email restricted/.test(errorMessage)) {
    return CATEGORIES.RESTRICTED;
  } else if (/already invited|already in organization/.test(errorMessage)) {
    return CATEGORIES.EXISTING;
  } else if (/Must reactivate/.test(errorMessage)) {
    return CATEGORIES.MUST_REACTIVATE;
  } else if (/username not found/.test(errorMessage)) {
    return CATEGORIES.USERNAME_NOT_FOUND;
  } else if (/Must first transfer account to the/.test(errorMessage)) {
    return CATEGORIES.NOT_IN_ENTERPRISE;
  } else if (/No Enterprise licenses/.test(errorMessage)) {
    return CATEGORIES.NO_ENTERPRISE_LICENSES;
  } else if (/rate limit|invitation quota|sign-up quota/.test(errorMessage)) {
    return CATEGORIES.RATE_LIMIT;
  } else if (/ORGANIZATION_TOO_MANY_MEMBERSHIPS/.test(errorMessage)) {
    return CATEGORIES.TOO_MANY_MEMBERS;
  } else if (/MEMBER_TOO_MANY_MEMBERSHIPS/.test(errorMessage)) {
    return CATEGORIES.MEMBER_TOO_MANY_ORGS;
  } else if (/Member is deactivated in the/.test(errorMessage)) {
    return CATEGORIES.DEACTIVATED_IN_THE_ENTERPRISE;
  } else if (
    /must be a managed enterprise member or have valid email/.test(errorMessage)
  ) {
    return CATEGORIES.MUST_BE_MANAGED_ENT_MEMBER_OR_VALID_EMAIL;
  } else if (/must be a managed enterprise member/.test(errorMessage)) {
    return CATEGORIES.MUST_BE_MANAGED_ENT_MEMBER;
  } else if (/confirm account to send more invitations/.test(errorMessage)) {
    return CATEGORIES.MEMBERSHIPS_TOO_MANY_UNCONFIRMED_INVITATIONS;
  } else if (
    /Unauthorized to grant licenses to non-enterprise members/.test(
      errorMessage,
    )
  ) {
    return CATEGORIES.UNAUTHORIZED_LICENSED_INVITE;
  } else {
    return CATEGORIES.UNKNOWN;
  }
};
