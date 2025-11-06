export const InviteRestrictValues = {
  ANY: 'any',
  MANAGED: 'managed',
  MANAGED_OR_DOMAIN: 'managed-or-domain',
  DOMAIN: 'domain',
} as const;

export const BoardInviteRestrictValues = {
  ANY: 'any',
  ORG: 'org',
  MANAGED: 'managed',
  ORG_OR_MANAGED: 'org-or-managed',
  LICENSED: 'licensed',
  LICENSED_OR_MANAGED: 'licensed-or-managed',
} as const;
export type BoardInviteRestrictValue =
  (typeof BoardInviteRestrictValues)[keyof typeof BoardInviteRestrictValues];
