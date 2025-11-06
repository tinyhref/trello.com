import type { Board, Member, Organization } from '@trello/model-types';

import { allowsSelfJoin } from '../board/allowsSelfJoin';
import { isMemberOfBoard } from '../board/isMemberOfBoard';
import { isMemberTypeOfBoard } from '../board/isMemberTypeOfBoard';
import { getMembershipTypeFromOrganization } from '../organization/getMembershipTypeFromOrganization';

/**
 * Checks if a user has permission to comment or react to a board/card notification.
 */
export const canComment = (
  member: Pick<
    Member,
    'id' | 'idEnterprisesAdmin' | 'idPremOrgsAdmin' | 'memberType'
  >,
  board: {
    idOrganization?: string | null;
    prefs?: Pick<
      Partial<Board['prefs']>,
      'comments' | 'isTemplate' | 'selfJoin'
    > | null;
    memberships: Pick<
      Board['memberships'][number],
      'deactivated' | 'idMember' | 'memberType' | 'unconfirmed'
    >[];
  },
  organization:
    | (Pick<Organization, 'id' | 'offering'> & {
        idEnterprise?: string | null;
        memberships: Pick<
          Organization['memberships'][number],
          'deactivated' | 'idMember' | 'memberType' | 'unconfirmed'
        >[];
      })
    | null,
): boolean => {
  if (!board.prefs?.comments) {
    return false;
  }

  const isMember = isMemberOfBoard(board, member.id);
  const isMemberOrg =
    !!board?.idOrganization &&
    !!organization &&
    ['admin', 'normal'].includes(
      getMembershipTypeFromOrganization(member, organization) || '',
    );
  const isMemberObserver = isMemberTypeOfBoard(
    member,
    board,
    organization,
    'observer',
  );
  const isImplicitAdmin = isMemberTypeOfBoard(
    member,
    board,
    organization,
    'admin',
  );
  const isBoardWorkspaceEditable = allowsSelfJoin(board);

  switch (board.prefs.comments) {
    case 'public':
      return !!member.id;
    case 'org':
      return isMember || isMemberOrg || isMemberObserver;
    case 'observers':
      return (
        isMember ||
        isMemberObserver ||
        isImplicitAdmin ||
        (isMemberOrg && isBoardWorkspaceEditable)
      );
    case 'members':
      return (
        (isMember && !isMemberObserver) ||
        isImplicitAdmin ||
        (isMemberOrg && isBoardWorkspaceEditable)
      );
    default:
      return false;
  }
};
