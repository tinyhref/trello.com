export const OrganizationErrorExtensions = {
  ORG_NAME_TAKEN: 'ORG_NAME_TAKEN',
  ORG_NAME_SHORT: 'ORG_NAME_SHORT',
  ORG_NAME_INVALID: 'ORG_NAME_INVALID',
  ORG_NAME_RESERVED: 'ORG_NAME_RESERVED',
  ORG_DISPLAY_NAME_SHORT: 'ORG_DISPLAY_NAME_SHORT',
  ORG_DISPLAY_NAME_LONG: 'ORG_DISPLAY_NAME_LONG',
  ORG_SHORT_NAME_LONG: 'ORG_SHORT_NAME_LONG',
  ORG_INVALID_TEAM_TYPE: 'ORG_INVALID_TEAM_TYPE',
  GM_ERROR: 'GM_ERROR',
  CANNOT_MODIFY_MEMBERSHIPS: 'CANNOT_MODIFY_MEMBERSHIPS',
  NOT_ENOUGH_ADMINS: 'NOT_ENOUGH_ADMINS',
  NO_PERMISSION_TO_DELETE_WORKSPACE: 'NO_PERMISSION_TO_DELETE_WORKSPACE',
} as const;
type OrganizationErrorExtensionsType =
  (typeof OrganizationErrorExtensions)[keyof typeof OrganizationErrorExtensions];

export const OrganizationErrors: Record<
  string,
  OrganizationErrorExtensionsType
> = {
  'Organization short name must be at least 3 characters':
    OrganizationErrorExtensions.ORG_NAME_SHORT,
  'Organization short name is taken':
    OrganizationErrorExtensions.ORG_NAME_TAKEN,
  'Organization short name is reserved':
    OrganizationErrorExtensions.ORG_NAME_RESERVED,
  'Organization name is invalid': OrganizationErrorExtensions.ORG_NAME_INVALID,
  'Display Name cannot begin or end with a space':
    OrganizationErrorExtensions.ORG_NAME_INVALID,
  'invalid value for teamType':
    OrganizationErrorExtensions.ORG_INVALID_TEAM_TYPE,
  'Display Name must be at least 3 characters':
    OrganizationErrorExtensions.ORG_DISPLAY_NAME_SHORT,
  'Display Name must be at most 100 characters':
    OrganizationErrorExtensions.ORG_DISPLAY_NAME_LONG,
  'Organization short name must be at most 100 characters':
    OrganizationErrorExtensions.ORG_SHORT_NAME_LONG,
  'Could not process image': OrganizationErrorExtensions.GM_ERROR,
  'Not a valid image format': OrganizationErrorExtensions.GM_ERROR,
  'Free workspaces cannot change memberships':
    OrganizationErrorExtensions.CANNOT_MODIFY_MEMBERSHIPS,
  'Not enough admins': OrganizationErrorExtensions.NOT_ENOUGH_ADMINS,
  'workspace admin does not have permission to close all workspace boards':
    OrganizationErrorExtensions.NO_PERMISSION_TO_DELETE_WORKSPACE,
};
