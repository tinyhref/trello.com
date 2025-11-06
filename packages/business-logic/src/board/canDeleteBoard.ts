import { Entitlements } from '@trello/entitlements';
import type { Board, Member, Organization } from '@trello/model-types';

import { isAdminOfBoard } from './isAdminOfBoard';

export const canDeleteBoard = (
  member: Pick<
    Member,
    'id' | 'idEnterprisesAdmin' | 'idPremOrgsAdmin' | 'memberType'
  >,
  board: Pick<Board, 'id'> & {
    memberships: Pick<
      Board['memberships'][number],
      'deactivated' | 'id' | 'idMember' | 'memberType' | 'unconfirmed'
    >[];
    organization?:
      | (Pick<Board['organization'], 'id' | 'offering'> & {
          memberships: Pick<
            Board['organization']['memberships'][number],
            'deactivated' | 'idMember' | 'memberType' | 'unconfirmed'
          >[];
        })
      | null;
    prefs?: Pick<Board['prefs'], 'permissionLevel'> | null;
  },
  workspace?: {
    prefs?: {
      boardDeleteRestrict?: Organization['prefs']['boardDeleteRestrict'] | null;
    } | null;
    memberships?:
      | Pick<Organization['memberships'][number], 'idMember' | 'memberType'>[]
      | null;
  },
): boolean => {
  if (!board) {
    return false;
  }

  const isAdmin = isAdminOfBoard(member, board);
  if (!isAdmin) {
    return false;
  }

  if (!workspace) {
    return true;
  }

  const workspaceDeleteRestrictions = workspace?.prefs?.boardDeleteRestrict;
  if (!workspaceDeleteRestrictions) {
    return true;
  }

  const boardPermission = board?.prefs?.permissionLevel;
  if (!boardPermission) {
    return true;
  }

  const workspaceDeleteRestriction =
    workspaceDeleteRestrictions[boardPermission];

  switch (workspaceDeleteRestriction) {
    case 'org':
      return true;

    case 'admin': {
      const isWorkspaceAdmin = (workspace.memberships || []).some(
        ({ idMember, memberType }) => {
          return idMember === member.id && memberType === 'admin';
        },
      );

      if (
        isWorkspaceAdmin &&
        !Entitlements.isFree(board.organization?.offering)
      ) {
        return true;
      }

      return false;
    }

    default:
      return false;
  }
};
