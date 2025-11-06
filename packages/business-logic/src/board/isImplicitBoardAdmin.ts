import { isEnterpriseAdmin } from '@trello/business-logic/enterprise';
import type { BoardMembership, Member } from '@trello/model-types';

import { getMembershipsMap } from '../membership/getMembershipsMap';
import { isPremOrganizationAdmin } from '../organization/isPremOrganizationAdmin';
import { getAdminBoardMembers } from './getAdminBoardMembers';

/**
 * Utility to help determine if a given member is an implicit board
 * admin.
 * NOTE: Do not use this in a loop, you should use getAdminBoardMembers if you
 * want a list of members that are implicit admins.
 * @param board
 * @param idMember
 * @returns boolean
 */
export const isImplicitBoardAdmin = (
  board: {
    memberships: Pick<
      BoardMembership[number],
      'idMember' | 'memberType' | 'orgMemberType'
    >[];
    members: (Pick<Member, 'id' | 'idPremOrgsAdmin'> & {
      idEnterprisesAdmin?: string[] | null;
    })[];
    idOrganization?: string | null;
    idEnterprise?: string | null;
  },
  idMember: string,
) => {
  const members = getAdminBoardMembers(
    board.members,
    getMembershipsMap(board.memberships),
    board.idOrganization ?? null,
    board.idEnterprise ?? null,
  );

  return members.some((member) => {
    return (
      (member.id === idMember &&
        board.idOrganization &&
        isPremOrganizationAdmin(member, board.idOrganization)) ||
      isEnterpriseAdmin(
        { idEnterprisesAdmin: member.idEnterprisesAdmin ?? [] },
        board.idEnterprise ?? '',
      )
    );
  });
};
