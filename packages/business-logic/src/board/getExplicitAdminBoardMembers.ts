import type { Board, BoardMembership } from '@trello/model-types';

import type { MembershipsMap } from '../membership/getMembershipsMap';
import { isMembershipAdmin } from '../membership/isMembershipAdmin';
import { getBoardMembersByMembershipType } from './getBoardMembersByMembershipType';

/**
 * Uses the members and memberships to determine which of the members are
 * explicit admins of the board, meaning memberType === 'admin'.
 * NOTE: You should typically use getAdminBoardMembers because it will also
 * use idPremOrgsAdmin and orgMemberType to determine if they are an implicit admin.
 * @param members List of members from the board
 * @param memberships List of memberships for the board
 * @returns List of members that have admin priviledges
 */
export function getExplicitAdminBoardMembers<
  TMembers extends Pick<Board['members'][number], 'id'>[],
  TMemberships extends Pick<
    BoardMembership[number],
    'idMember' | 'memberType'
  >[],
>(members: TMembers, membershipsMap: MembershipsMap<TMemberships>): TMembers {
  return getBoardMembersByMembershipType(
    members,
    membershipsMap,
    isMembershipAdmin,
  );
}
