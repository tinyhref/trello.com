import { useMemberId } from '@trello/authentication';

import { useMemberNodeIdFragment } from './MemberNodeIdFragment.generated';

/**
 * Custom hook to retrieve the node ID for the current member.
 *
 * This hook uses the `useMemberId` hook to get the current member's ID,
 * then fetches the member's node ID using the `useMemberNodeIdFragment` hook.
 *
 * The node ID is used to uniquely identify a member in the Trello system.
 * If the member data is not available or the node ID is null, an empty string is returned.
 *
 * @returns The member's node ID as a string, or an empty string if not available
 */

export const useMemberNodeId = () => {
  const memberId = useMemberId();

  const { data: member } = useMemberNodeIdFragment({
    from: { id: memberId },
    optimistic: true,
  });

  return member?.nodeId || '';
};
