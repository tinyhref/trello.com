import { useMemberId } from '@trello/authentication';

import { useMemberContextDataFragment } from './MemberContextDataFragment.generated';

export const useMemberContextData = () => {
  const memberId = useMemberId();

  const { data } = useMemberContextDataFragment({
    from: { id: memberId },
    returnPartialData: true,
  });

  return { member: data };
};
