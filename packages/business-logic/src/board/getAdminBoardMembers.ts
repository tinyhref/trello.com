import { isEnterpriseAdmin } from '@trello/business-logic/enterprise';
import type { Board, BoardMembership } from '@trello/model-types';

import type { MembershipsMap } from '../membership/getMembershipsMap';
import { isMembershipAdmin } from '../membership/isMembershipAdmin';
import { isPremOrganizationAdmin } from '../organization/isPremOrganizationAdmin';
import { getBoardMembersByMembershipType } from './getBoardMembersByMembershipType';

/**
 * Uses the members and memberships to determine which of the members are either
 * explicit admins of the board, or implicit admins of the board. You can be implicit
 * admin if you have membership.orgMemberType 'admin' and are a premium org admin.
 * @param members List of members from the board
 * @param memberships List of memberships for the board
 * @param idOrganization the idOrganization for the board
 * @returns List of members that have implicit admin priviledges
 */
export const getAdminBoardMembers = <
  TMembers extends (Pick<Board['members'][number], 'id' | 'idPremOrgsAdmin'> & {
    idEnterprisesAdmin?: string[] | null;
  })[],
  TMemberships extends Pick<
    BoardMembership[number],
    'idMember' | 'memberType' | 'orgMemberType'
  >[],
>(
  members: TMembers,
  membershipsMap: MembershipsMap<TMemberships>,
  idOrganization: string | null,
  idEnterprise?: string | null,
): TMembers => {
  return getBoardMembersByMembershipType(
    members,
    membershipsMap,
    (membership, member) => {
      if (isMembershipAdmin(membership)) {
        return true;
      }
      if (
        idEnterprise &&
        member.idEnterprisesAdmin &&
        isEnterpriseAdmin(
          { idEnterprisesAdmin: member.idEnterprisesAdmin },
          idEnterprise,
        )
      ) {
        return true;
      }

      if (
        idOrganization &&
        isPremOrganizationAdmin(member, idOrganization) &&
        membership.orgMemberType === 'admin'
      ) {
        return true;
      }

      return false;
    },
  );
};
