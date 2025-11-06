import { isEnterpriseAdmin } from '@trello/business-logic/enterprise';
import { isPremOrganizationAdmin } from '@trello/business-logic/organization';
import type { Board, Member } from '@trello/model-types';

import { canInviteMembers } from './canInviteMembers';
import { compareMemberTypes } from './compareMemberTypes';
import { getMemberTypeFromBoard } from './getMemberTypeFromBoard';
import { isAdminOfBoard } from './isAdminOfBoard';
import { isImplicitBoardAdmin } from './isImplicitBoardAdmin';

/**
 * Checks if a member has permissions to remove members from the board.
 */
export const canRemoveMember = (
  me: Pick<Member, 'id' | 'idPremOrgsAdmin' | 'memberType'> & {
    idEnterprisesAdmin?: string[] | null;
  },
  subject: Pick<Member, 'id' | 'idPremOrgsAdmin' | 'memberType'> & {
    idEnterprisesAdmin?: string[] | null;
  },
  board: Pick<Board, 'memberships'> & {
    prefs?: Pick<
      NonNullable<Board['prefs']>,
      'canInvite' | 'invitations'
    > | null;
    idOrganization?: string | null;
    idEnterprise?: string | null;
    members: (Pick<Board['members'][number], 'id' | 'idPremOrgsAdmin'> & {
      idEnterprisesAdmin?: string[] | null;
    })[];
  },
  organization?:
    | (Pick<Board['organization'], 'id' | 'offering'> & {
        memberships: Pick<
          Board['organization']['memberships'][number],
          'deactivated' | 'id' | 'idMember' | 'memberType' | 'unconfirmed'
        >[];
      })
    | null,
) => {
  // There are cases where `memberships` are returning null
  // and are not caught by typescript
  // TODO investigate how board.memberships can be null and why
  // typescript is not catching these errors
  if (!board.memberships) {
    return false;
  }

  // If there are no other explicit board admins, also check if this board is in a paid organization and has a member who is a organization admin
  const boardHasMoreThanOneAdmin = board.memberships.some(
    ({ idMember, memberType }) =>
      idMember !== subject.id && memberType === 'admin',
  );

  // Only checks board memberships, so will return false if member is not part of the board
  const isBoardMemberAndImplicitAdmin = isImplicitBoardAdmin(board, me.id);

  const isPremWorkspaceAdmin = isPremOrganizationAdmin(
    me,
    board.idOrganization ?? '',
  );
  const isEntAdmin = isEnterpriseAdmin(
    { idEnterprisesAdmin: me.idEnterprisesAdmin ?? [] },
    board.idEnterprise ?? '',
  );
  const isImplicitAdmin =
    isBoardMemberAndImplicitAdmin || isPremWorkspaceAdmin || isEntAdmin;

  const boardHasMoreThanOneMember = board.memberships.length > 1;
  const amAdmin = isAdminOfBoard(me, board);
  const amSubject = me.id === subject.id;

  if (boardHasMoreThanOneMember) {
    if (boardHasMoreThanOneAdmin) {
      if (amAdmin || amSubject || isImplicitAdmin) {
        return true;
      }
    } else if (!isAdminOfBoard(subject, board, false)) {
      if (isImplicitAdmin) {
        return true;
      }
    } else if (isAdminOfBoard(subject, board, false)) {
      // The last board admin may never be removed
      return false;
    }

    // on a given member in board.members yet
    const subjectMemberType = getMemberTypeFromBoard(
      subject,
      board,
      organization,
      false,
    );
    if (
      !amSubject &&
      subjectMemberType !== 'org' &&
      canInviteMembers(me, board) &&
      compareMemberTypes(
        getMemberTypeFromBoard(me, board, organization),
        subjectMemberType,
      ) >= 0
    ) {
      return true;
    }
  }
  return false;
};
