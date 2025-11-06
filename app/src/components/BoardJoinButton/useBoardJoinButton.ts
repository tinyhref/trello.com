import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { useBoardMembers } from '@trello/business-logic-react/board';
import { allowsSelfJoin } from '@trello/business-logic/board';
import { isPremOrganizationAdmin } from '@trello/business-logic/organization';
import { useBoardId } from '@trello/id-context';

import { useNativeGraphqlMigrationMilestone3 } from 'app/src/components/App/useNativeGraphqlMigrationMilestone3';
import { useBoardJoinButtonBoardFragment } from './BoardJoinButtonBoardFragment.generated';
import { useBoardJoinButtonMemberFragment } from './BoardJoinButtonMemberFragment.generated';
import { useTrelloBoardJoinButtonBoardFragment } from './TrelloBoardJoinButtonBoardFragment.generated';

interface UseBoardJoinButtonProps {
  boardId: string;
}

export const useBoardJoinButton = ({ boardId }: UseBoardJoinButtonProps) => {
  const memberId = useMemberId();
  const nativeBoardId = useBoardId(true);
  const shouldUseNativeGraphQL = useNativeGraphqlMigrationMilestone3();
  const { isAdmin, isMember, isMemberOfOrganization } =
    useBoardMembers(boardId);

  const { data: boardData } = useBoardJoinButtonBoardFragment({
    from: { id: boardId },
  });

  const { data: nativeBoardData } = useTrelloBoardJoinButtonBoardFragment({
    from: { id: nativeBoardId },
  });

  const { data: memberData } = useBoardJoinButtonMemberFragment({
    from: { id: memberId },
  });

  const board = shouldUseNativeGraphQL ? nativeBoardData : boardData;
  const workspace = shouldUseNativeGraphQL
    ? nativeBoardData?.workspace
    : boardData?.organization;
  const workspaceId = shouldUseNativeGraphQL
    ? nativeBoardData?.workspace?.id
    : boardData?.idOrganization;
  const enterpriseId = shouldUseNativeGraphQL
    ? nativeBoardData?.enterprise?.id
    : boardData?.idEnterprise;
  const adminEdges = nativeBoardData?.workspace?.enterprise?.admins?.edges;
  const adminIds = boardData?.organization?.enterprise?.idAdmins;
  const member = memberData;

  const confirmed = member?.confirmed ?? false;

  const memberType = useMemo(
    () => (isAdmin(memberId) ? 'admin' : 'normal'),
    [isAdmin, memberId],
  );

  const showJoinButton = useMemo(() => {
    if (!board || !member) {
      return false;
    }

    if (!workspaceId && !enterpriseId) {
      return false;
    }

    if (isMember(memberId)) {
      return false;
    }

    const isPremOrgAdmin = isPremOrganizationAdmin(member, workspaceId ?? '');

    if (isPremOrgAdmin) {
      return true;
    }

    const isOrgMember = isMemberOfOrganization(memberId);
    const canSelfJoin = allowsSelfJoin(board);

    if (isOrgMember && canSelfJoin) {
      return true;
    }

    const isEnterpriseBoard = !!enterpriseId || !!workspace?.enterprise;

    const isMemberAnAdminNative = adminEdges?.some(
      (admin) => admin?.node?.id === member.id,
    );
    const memberIsAdmin = shouldUseNativeGraphQL
      ? isMemberAnAdminNative
      : adminIds?.includes(member.id);

    if (isEnterpriseBoard && memberIsAdmin) {
      return true;
    }

    return false;
  }, [
    board,
    member,
    workspaceId,
    enterpriseId,
    isMember,
    memberId,
    isMemberOfOrganization,
    workspace?.enterprise,
    adminEdges,
    shouldUseNativeGraphQL,
    adminIds,
  ]);

  return {
    confirmed,
    memberType,
    showJoinButton,
  };
};
