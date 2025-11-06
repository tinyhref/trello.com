import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { useBoardMembers } from '@trello/business-logic-react/board';

interface BoardMembershipGroupings {
  invited: string[];
  guest: string[];
  deactivated: string[];
  observer: string[];
  team: string[];
  members: string[];
}

export const useBoardMembershipGroupings = (
  memberIds: string[],
  idBoard: string,
  idOrganization?: string | null,
): BoardMembershipGroupings => {
  const idMember = useMemberId();
  const {
    getMembership,
    getMember,
    isMemberDeactivated,
    isMemberOfOrganization,
    isAdminOfOrganization,
  } = useBoardMembers(idBoard);

  const hasActiveBoardMembership =
    getMembership(idMember)?.memberType &&
    !getMembership(idMember)?.deactivated;

  const isAffiliated =
    hasActiveBoardMembership || isMemberOfOrganization(idMember);

  return useMemo(() => {
    if (isAffiliated) {
      return memberIds.reduce<BoardMembershipGroupings>(
        (acc, memberId) => {
          const { invited, guest, deactivated, observer, team, members } = acc;
          const boardMembership = getMembership(memberId);
          const member = getMember(memberId);

          const isOrgMember = isMemberOfOrganization(memberId);
          const isWorkspaceAdmin = isAdminOfOrganization(memberId);

          if (member?.memberType === 'ghost') {
            invited.push(memberId);
          } else if (!boardMembership) {
            guest.push(memberId);
          } else if (isMemberDeactivated(memberId)) {
            deactivated.push(memberId);
          } else if (
            boardMembership.memberType === 'observer' &&
            !isWorkspaceAdmin
          ) {
            observer.push(memberId);
          } else if (boardMembership.orgMemberType || isOrgMember) {
            team.push(memberId);
          } else if (!idOrganization) {
            members.push(memberId);
          } else {
            guest.push(memberId);
          }

          return {
            members,
            invited,
            guest,
            deactivated,
            observer,
            team,
          };
        },
        {
          members: [],
          invited: [],
          guest: [],
          deactivated: [],
          observer: [],
          team: [],
        },
      );
    } else {
      return {
        members: [
          ...memberIds.filter(
            (memberId) => !getMembership(memberId)?.deactivated,
          ),
        ],
        invited: [],
        guest: [],
        deactivated: [],
        observer: [],
        team: [],
      };
    }
  }, [
    getMember,
    getMembership,
    isMemberDeactivated,
    idOrganization,
    isAdminOfOrganization,
    isAffiliated,
    isMemberOfOrganization,
    memberIds,
  ]);
};
