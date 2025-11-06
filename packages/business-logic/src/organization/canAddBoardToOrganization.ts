import type {
  Board_PermissionLevel,
  Organization,
  Organization_Prefs_BoardVisibilityRestrict,
} from '@trello/model-types';

import { canSetVisibilityOnBoard } from './canSetVisibilityOnBoard';

interface CanAddBoardToOrganizationArgs {
  org: Pick<Organization, 'premiumFeatures'> & {
    idEnterprise?: string | null;
    prefs?: {
      boardVisibilityRestrict?: Organization_Prefs_BoardVisibilityRestrict | null;
    } | null;
  };
  board: {
    prefs?: {
      permissionLevel?: Board_PermissionLevel;
    } | null;
  };
  isOrgAdmin: boolean;
}

/**
 * Checks if a member has the necessary permissions to add a board to an organization.
 */
export const canAddBoardToOrganization = ({
  org,
  board,
  isOrgAdmin,
}: CanAddBoardToOrganizationArgs) => {
  // Unpack the board's permission level / visibility
  const boardVisibility = board.prefs?.permissionLevel;
  if (!boardVisibility) {
    return false;
  }

  // Delegate to the visibility check for the board attempting to be added to the org
  return canSetVisibilityOnBoard({ org, boardVisibility, isOrgAdmin });
};
