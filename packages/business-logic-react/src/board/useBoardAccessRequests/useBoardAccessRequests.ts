import { useMemberId } from '@trello/authentication';

import { useBoardMembers } from '../useBoardMembers';
import { useBoardAccessRequestsQuery } from './BoardAccessRequestsQuery.generated';

export const useBoardAccessRequests = ({ boardId }: { boardId: string }) => {
  const { isAdmin } = useBoardMembers(boardId);
  const memberId = useMemberId();
  const isMemberAdmin = isAdmin(memberId);

  const { data: accessRequestsData, loading } = useBoardAccessRequestsQuery({
    variables: { boardId },
    waitOn: ['None'],
    skip: !isMemberAdmin,
  });

  return {
    isMemberAdmin,
    loading,
    accessRequests: accessRequestsData?.board?.accessRequests,
  };
};
