import type { Board, BoardMembership } from '@trello/model-types';

import type { MembershipsMap } from '../membership/getMembershipsMap';

/**
 * Utility function to get a list of members based on a membership filter.
 * @param members List of members for the board
 * @param memberships List of memberships for the board
 * @param membershipFilter A filter that will be called with the membership and member
 * that you can use to filter the members that you get back.
 * @returns List of members meeting the membershipFilter
 */
export const getBoardMembersByMembershipType = <
  TMembers extends Pick<Board['members'][number], 'id'>[],
  TMemberships extends Pick<
    BoardMembership[number],
    'idMember' | 'memberType'
  >[],
>(
  members: TMembers,
  membershipsMap: MembershipsMap<TMemberships>,
  membershipFilter: (
    membership: TMemberships[number],
    member: TMembers[number],
  ) => boolean,
): TMembers => {
  return members.filter((member) => {
    const membership = membershipsMap.get(member.id);
    if (!membership) {
      return false;
    }

    return membershipFilter(membership, member);
  }) as TMembers;
};
