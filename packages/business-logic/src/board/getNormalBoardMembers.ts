import type { Board, BoardMembership } from '@trello/model-types';

import type { MembershipsMap } from '../membership/getMembershipsMap';
import { isMembershipNormal } from '../membership/isMembershipNormal';
import { getBoardMembersByMembershipType } from './getBoardMembersByMembershipType';

/**
 * Uses the members and memberships to determine which of the members are
 * explicit normal of the board, meaning memberType === 'normal'
 * @param members List of members from the board
 * @param memberships List of memberships for the board
 * @returns List of members that have normal priviledges
 */
export const getNormalBoardMembers = <
  TMembers extends Pick<Board['members'][number], 'id'>[],
  TMemberships extends Pick<
    BoardMembership[number],
    'idMember' | 'memberType'
  >[],
>(
  members: TMembers,
  membershipsMap: MembershipsMap<TMemberships>,
): TMembers => {
  return getBoardMembersByMembershipType(
    members,
    membershipsMap,
    isMembershipNormal,
  );
};
