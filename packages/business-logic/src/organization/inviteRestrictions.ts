export const InviteRestrictions = {
  ANY: 'any',
  MANAGED: 'managed',
  MANAGED_OR_DOMAIN: 'managed-or-domain',
  DOMAIN: 'domain',
} as const;

export type InviteRestrictValues =
  (typeof InviteRestrictions)[keyof typeof InviteRestrictions];

/**
 * Org invite restrictions is an array of strings that will contain one of the above values
 * and possibly a list of allowed domains. The order of these values is not guaranteed, so these
 * helpers are used to distinguish the restriction value from the domain list.
 */
const isRestrictionValue = (restriction: string): boolean =>
  Object.values(InviteRestrictions).includes(
    restriction as InviteRestrictValues,
  );

/**
 * Pull the restriction value from the raw `orgInviteRestrict` array.
 * Returns "any" if it cannot find a valid restriction value; which is
 * the default value in MongoDB for this field.
 */
export const getOrgInviteRestrictValue = (
  restrictions?: string[] | null,
): InviteRestrictValues =>
  (restrictions?.find(isRestrictionValue) as InviteRestrictValues) ??
  InviteRestrictions.ANY;

/**
 * Returns true if the raw `orgInviteRestrict` array contains
 * the "domain" or "managed-or-domain" restriction, indicating that
 * the organization has specific email domains that are allowed to join.
 */
export const isOrgInviteDomainRestricted = (restrictions?: string[] | null) => {
  const value = getOrgInviteRestrictValue(restrictions);
  return (
    value === InviteRestrictions.DOMAIN ||
    value === InviteRestrictions.MANAGED_OR_DOMAIN
  );
};

/**
 * Pull the list of allowed domains from the raw `orgInviteRestrict` array.
 */
export const getOrgInviteRestrictDomainList = (
  restrictions?: string[] | null,
) =>
  isOrgInviteDomainRestricted(restrictions)
    ? (restrictions?.filter((value) => !isRestrictionValue(value)) ?? [])
    : [];
