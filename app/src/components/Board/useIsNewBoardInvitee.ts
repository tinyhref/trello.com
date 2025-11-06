import { useMemberId } from '@trello/authentication';
import { getDateBefore, idToDate } from '@trello/dates';
import { useBoardId, useWorkspaceId } from '@trello/id-context';

import { useNewBoardInviteeFragment } from './NewBoardInviteeFragment.generated';

export const useIsNewBoardInvitee = () => {
  const memberId = useMemberId();
  const boardId = useBoardId();
  const workspaceId = useWorkspaceId();

  const { data: memberData } = useNewBoardInviteeFragment({
    from: { id: memberId },
    returnPartialData: true,
  });

  const isInvitedBoardMember =
    memberData?.idBoards?.length === 1 &&
    memberData?.idBoards?.[0] === boardId &&
    memberData?.idMemberReferrer !== null;

  const isWorkspaceMember =
    // invited new user will only have one workspace
    (memberData?.organizations?.length === 1 &&
      memberData.organizations?.[0]?.id === workspaceId) ??
    false;

  const campaigns = memberData?.campaigns ?? [];
  const newUserOnboardingCampaign = campaigns?.find(
    (c: { name: string }) => c.name === 'moonshot' || c.name === 'splitscreen',
  );

  // invited new user will not go through new user onboarding
  const wentThroughNewUserOnboarding =
    newUserOnboardingCampaign?.dateDismissed !== undefined &&
    newUserOnboardingCampaign.dateDismissed !== null;

  const isNewUser = idToDate(memberId) > getDateBefore({ days: 7 });

  return {
    isEligible:
      !wentThroughNewUserOnboarding &&
      isNewUser &&
      isInvitedBoardMember &&
      !isWorkspaceMember,
  };
};
