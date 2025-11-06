import { useMemberId } from '@trello/authentication';
import { useBoardMembers } from '@trello/business-logic-react/board';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { useWorkspaceUserLimit } from '@trello/workspaces/user-limit';

import { useHasEndOfTrialFriction } from 'app/src/components/EndOfTrialFriction';
import { getOneTimeMessageKey as getEndOfTrialFrictionOneTimeMessageKey } from 'app/src/components/EndOfTrialFriction/EndOfTrialFrictionDialog/EndOfTrialFrictionDialog';

interface HookOptions {
  boardId: string | null;
  workspaceId: string | null;
}

export const useReadOnlyBoardModal = ({
  boardId,
  workspaceId,
}: HookOptions) => {
  const memberId = useMemberId();
  const { isMember } = useBoardMembers(boardId ?? '');
  const isUserBoardMember = isMember(memberId);

  const { isWorkspaceReadOnly, isUserWorkspaceMember } = useWorkspaceUserLimit({
    workspaceId,
  });

  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();

  const hasEndOfTrialFriction = useHasEndOfTrialFriction();

  const isCollaborator = isUserBoardMember || isUserWorkspaceMember;

  const endOfTrialDismissed = isOneTimeMessageDismissed(
    getEndOfTrialFrictionOneTimeMessageKey(workspaceId ?? ''),
  );

  return {
    wouldRender:
      isWorkspaceReadOnly &&
      isCollaborator &&
      (!hasEndOfTrialFriction || endOfTrialDismissed),
  };
};
