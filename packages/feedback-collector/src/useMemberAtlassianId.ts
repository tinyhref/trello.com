import { useMemberId } from '@trello/authentication';

import { useMemberAtlassianIdQuery } from './MemberAtlassianIdQuery.generated';

export const useMemberAtlassianId = ({ skip }: { skip?: boolean }) => {
  const memberId = useMemberId();
  const { data } = useMemberAtlassianIdQuery({
    variables: { memberId },
    waitOn: ['MemberHeader'],
    skip,
  });
  return {
    aaId: data?.member?.aaId || undefined,
  };
};
