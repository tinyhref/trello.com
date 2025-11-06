import { useCallback, useMemo } from 'react';
import { useContextSelector } from 'use-context-selector';

import { isMemberLoggedIn, useMemberId } from '@trello/authentication';
import { useIsTemplateBoard } from '@trello/business-logic-react/board';
import { useBoardId, useWorkspaceId } from '@trello/id-context';
import { useWorkspaceUserLimit } from '@trello/workspaces/user-limit';

import { BoardMembersContext } from 'app/src/components/BoardMembersContext';
import {
  useCanDeleteBoard,
  useCanEditBoard,
} from 'app/src/components/BoardPermissionsContext';
import { useBoardMenuDataFragment } from './BoardMenuDataFragment.generated';

export const useBoardMenu = () => {
  const boardId = useBoardId();
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const canEditBoard = useCanEditBoard();
  const isTemplate = useIsTemplateBoard(boardId);
  const canRemoveBoardMember = useContextSelector(
    BoardMembersContext,
    useCallback((value) => value.canRemoveBoardMember(memberId), [memberId]),
  );

  const { data: board } = useBoardMenuDataFragment({
    from: { id: boardId },
  });

  const { isWorkspaceReadOnly } = useWorkspaceUserLimit({
    workspaceId,
  });

  const isBoardAdmin = useContextSelector(BoardMembersContext, (value) =>
    value.isAdmin(memberId),
  );
  const isBoardMember = useContextSelector(BoardMembersContext, (value) =>
    value.isMember(memberId),
  );
  const isWorkspaceMember = useContextSelector(BoardMembersContext, (value) =>
    value.isMemberOfOrganization(memberId),
  );

  const canViewBoardSettings = useMemo(() => {
    if (!isMemberLoggedIn()) {
      return false;
    }

    const isPublic = board?.prefs?.permissionLevel === 'public';

    return isPublic ? isWorkspaceMember || isBoardMember : true;
  }, [board?.prefs?.permissionLevel, isBoardMember, isWorkspaceMember]);

  const canLeaveBoard = useMemo(() => {
    return isBoardMember && canRemoveBoardMember;
  }, [canRemoveBoardMember, isBoardMember]);

  const canDeleteBoard = useCanDeleteBoard();

  if (!board) {
    return {
      canEditBoard: false,
      canDeleteBoard: false,
      canLeaveBoard: false,
      canViewBoardSettings: false,
      isBoardAdmin: false,
      isBoardClosed: false,
      isBoardMember: false,
      isTemplate: false,
      isWorkspaceMember: false,
      isWorkspaceReadOnly: false,
    };
  }

  return {
    canEditBoard,
    canDeleteBoard,
    canLeaveBoard,
    canViewBoardSettings,
    isBoardAdmin,
    isBoardClosed: board.closed,
    isBoardMember,
    isTemplate,
    isWorkspaceMember,
    isWorkspaceReadOnly,
  };
};
