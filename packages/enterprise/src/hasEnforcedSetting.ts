type RestrictionOption = 'admin' | 'none' | 'org';
type PermissionOption = 'private' | 'public';

interface OrganizationPrefsRestriction {
  private?: RestrictionOption;
  org?: RestrictionOption;
  enterprise?: RestrictionOption;
  public?: RestrictionOption;
}

interface OrganizationPrefs {
  // "The restrictions on who can delete a Board"
  boardDeleteRestrict?: OrganizationPrefsRestriction;

  // "The restrictions on who can view a Board"
  boardVisibilityRestrict?: OrganizationPrefsRestriction;

  // "Restrictions on emails allowed to invite to the Organization"
  boardInviteRestrict?: string;

  // "Restrictions on emails allowed to invite to the Organization"
  orgInviteRestrict?: string[];

  // "The visibility of the Organization"
  permissionLevel?: PermissionOption | null;
}

const SETTINGS = {
  boardVisibilityRestrictions: [
    'boardVisibilityRestrict.private',
    'boardVisibilityRestrict.enterprise',
    'boardVisibilityRestrict.org',
    'boardVisibilityRestrict.public',
  ],
  boardDeleteRestrictions: [
    'boardDeleteRestrict.private',
    'boardDeleteRestrict.enterprise',
    'boardDeleteRestrict.org',
    'boardDeleteRestrict.public',
  ],
  boardInviteRestrict: ['boardInviteRestrict'],
  orgInviteRestrict: ['orgInviteRestrict'],
  permissionLevel: ['permissionLevel'],
};

export const hasEnforcedSetting = (
  setting: keyof typeof SETTINGS,
  organizationPrefs?: OrganizationPrefs,
) => {
  if (
    !SETTINGS[setting] ||
    !organizationPrefs ||
    Object.keys(organizationPrefs).length === 0
  ) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const overriddenSettings = SETTINGS[setting].filter((setting) => {
    let prefs = { ...organizationPrefs } as never;

    for (const path of setting.split('.')) {
      if (prefs[path] !== null) {
        prefs = prefs[path];
      } else {
        return false;
      }
    }

    return true;
  });

  return overriddenSettings.length === SETTINGS[setting].length;
};
