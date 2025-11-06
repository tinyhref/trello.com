import type { Board, Member } from '@trello/model-types';

import { isMemberOfOrganization } from '../organization/isMemberOfOrganization';
import { getMemberTypeFromBoard } from './getMemberTypeFromBoard';
import { isAdminOfBoard } from './isAdminOfBoard';

/**
 * Checks if a member has permissions to invite new members to the board.
 */
export const canInviteMembers = (
  member: Pick<Member, 'id' | 'idPremOrgsAdmin' | 'memberType'> & {
    idEnterprisesAdmin?: string[] | null;
  },
  board: {
    prefs?: Pick<Board['prefs'], 'canInvite' | 'invitations'> | null;
    memberships: Pick<
      Board['memberships'][number],
      'deactivated' | 'id' | 'idMember' | 'memberType' | 'unconfirmed'
    >[];
  },
  organization?:
    | (Pick<Board['organization'], 'id' | 'offering'> & {
        enterprise?: Pick<
          Board['organization']['enterprise'],
          'id' | 'idAdmins'
        > | null;
        memberships: Pick<
          Board['organization']['memberships'][number],
          'deactivated' | 'idMember' | 'memberType' | 'unconfirmed'
        >[];
      })
    | null,
): boolean => {
  // If member isn't in workspace, they cannot invite others if the workspace has restricted invites
  if (
    (!organization || !isMemberOfOrganization(member, organization)) &&
    !board.prefs?.canInvite
  )
    return false;

  if (
    board.prefs?.invitations === 'admins' &&
    !(organization && isAdminOfBoard(member, board))
  )
    return false;

  const memberType = getMemberTypeFromBoard(member, board, organization);

  return (
    memberType === 'admin' ||
    (board.prefs?.invitations === 'members' && memberType === 'normal')
  );
};
