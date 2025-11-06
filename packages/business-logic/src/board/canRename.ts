import { Entitlements } from '@trello/entitlements';
import type { Board, Member } from '@trello/model-types';

import { isAdminOfOrganization } from '../organization/isAdminOfOrganization';
import type { canEdit } from './canEdit';
import { getMemberTypeFromBoard } from './getMemberTypeFromBoard';

/**
 * Checks if a member has permissions to rename the board.
 */
export const canRename = (
  member: Pick<
    Member,
    'id' | 'idEnterprisesAdmin' | 'idPremOrgsAdmin' | 'memberType'
  >,
  board: {
    memberships: Pick<
      Board['memberships'][number],
      'deactivated' | 'id' | 'idMember' | 'memberType' | 'unconfirmed'
    >[];
  },
  organization: Parameters<typeof canEdit>[2],
  enterprise: Parameters<typeof canEdit>[3],
) => {
  // Member is a board admin
  const boardAdmin =
    getMemberTypeFromBoard(member, board, organization) === 'admin';
  // Member is a workspace admin in a paid org
  const workspaceAdmin =
    organization &&
    !Entitlements.isFree(organization.offering) &&
    isAdminOfOrganization(member, organization, enterprise);

  if (boardAdmin || workspaceAdmin) {
    return true;
  } else {
    return false;
  }
};
