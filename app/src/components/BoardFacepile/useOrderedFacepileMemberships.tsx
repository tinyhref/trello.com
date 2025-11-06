import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { useBoardMembers } from '@trello/business-logic-react/board';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';

const memberComparator = (
  membership: ReturnType<typeof useBoardMembers>['memberships'][number],
  priorityMemberId: string | null,
): number => {
  const memberId = membership.idMember;
  const isAdmin =
    membership.memberType === 'admin' || membership.orgMemberType === 'admin';
  // The current user is always first in the list
  if (memberId === priorityMemberId) {
    return -2;
  }
  // Admins toward the front
  if (isAdmin) {
    return -1;
  }
  // Ghost/unconfirmed towards the back
  if (membership.unconfirmed) {
    return 1;
  }
  // Deactivated users always come last
  if (membership.deactivated) {
    return 2;
  }
  // Everyone else somewhere in the middle
  return 0;
};

interface GetOrderedBoardMembershipsProps {
  // Moves the given member ID to the front of the returned array
  priorityMemberId?: string | null;
  // Whether deactivated memberships should be included in the result. Default false
  includeDeactivatedMemberships?: boolean;
  boardMemberships: ReturnType<typeof useBoardMembers>['memberships'];
  getMember: ReturnType<typeof useBoardMembers>['getMember'];
}

export const getOrderedBoardMemberships = ({
  priorityMemberId = null,
  includeDeactivatedMemberships = false,
  boardMemberships,
  getMember,
}: GetOrderedBoardMembershipsProps) => {
  return (
    [...boardMemberships]
      .sort((memberA, memberB) => {
        const memberAOrder = memberComparator(memberA, priorityMemberId);
        const memberBOrder = memberComparator(memberB, priorityMemberId);
        if (memberAOrder === memberBOrder) {
          const memberAString =
            dangerouslyConvertPrivacyString(
              getMember(memberA.idMember)?.fullName?.toLocaleLowerCase(),
            ) || '';

          const memberBString =
            dangerouslyConvertPrivacyString(
              getMember(memberB.idMember)?.fullName?.toLocaleLowerCase(),
            ) || '';

          return memberAString.localeCompare(memberBString);
        } else {
          return memberAOrder - memberBOrder;
        }
      })
      .filter((member) => {
        return !member.deactivated || includeDeactivatedMemberships;
      })
      .map((member) => member.idMember as string) ?? []
  );
};

export const useOrderedFacepileMemberships = (idBoard: string): string[] => {
  const loggedInMemberId = useMemberId();
  const { getMembership, getMember, isMemberOfOrganization, memberships } =
    useBoardMembers(idBoard);

  const loggedInBoardMembership = getMembership(loggedInMemberId);

  const loggedInUserIsBoardMember =
    (loggedInBoardMembership && !loggedInBoardMembership?.deactivated) ?? false;

  const includeDeactivatedMemberships = Boolean(
    isMemberOfOrganization(loggedInMemberId) || loggedInUserIsBoardMember,
  );

  return useMemo(
    () =>
      getOrderedBoardMemberships({
        priorityMemberId: loggedInMemberId,
        boardMemberships: memberships,
        getMember,
        includeDeactivatedMemberships,
      }),
    [getMember, includeDeactivatedMemberships, loggedInMemberId, memberships],
  );
};
