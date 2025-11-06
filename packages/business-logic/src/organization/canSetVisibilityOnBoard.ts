import type {
  Board_PermissionLevel,
  Organization,
  Organization_Prefs_BoardVisibilityRestrict,
} from '@trello/model-types';

interface CanSetVisibilityOnBoardArgs {
  org: Pick<Organization, 'premiumFeatures'> & {
    idEnterprise?: string | null;
    prefs?: {
      boardVisibilityRestrict?: Organization_Prefs_BoardVisibilityRestrict | null;
    } | null;
  };
  boardVisibility: Board_PermissionLevel;
  isOrgAdmin: boolean;
  isEnterpriseAdmin?: boolean;
}

/**
 * Checks if a member has the necessary permissions to set the desired board visibility.
 */
export const canSetVisibilityOnBoard = ({
  org,
  boardVisibility,
  isOrgAdmin,
  isEnterpriseAdmin,
}: CanSetVisibilityOnBoardArgs) => {
  // Cannot set Enterprise visibility for an org that does
  // not belong to a real enterprise
  if (
    boardVisibility === 'enterprise' &&
    (!org.idEnterprise || !org.premiumFeatures?.includes('enterpriseUI'))
  ) {
    return false;
  }

  if (!org.premiumFeatures?.includes('restrictVis')) {
    return true;
  }

  // Get the restriction for the visibility attempting to be set
  const boardVisibilityRestrict =
    org.prefs?.boardVisibilityRestrict?.[boardVisibility];

  // If there was no restriction for the visibility attempting to be set, allow it
  if (!boardVisibilityRestrict) {
    return true;
  }

  // If the restriction for the visibility attempting to be set was 'org', allow it
  if (boardVisibilityRestrict === 'org') {
    return true;
  }

  // If the restriction is admin only, allow it if we are an admin of the org OR the enterprise
  if (
    boardVisibilityRestrict === 'admin' &&
    (isOrgAdmin || isEnterpriseAdmin)
  ) {
    return true;
  }

  // If we get through all the checks, and couldn't allow, return false to be safe
  return false;
};
