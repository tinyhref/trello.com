import { useMemo, type FunctionComponent, type PropsWithChildren } from 'react';
import { createContext } from 'use-context-selector';

import { useMemberId } from '@trello/authentication';
import {
  canDeleteBoard as canDelete,
  canEdit,
  canRename,
} from '@trello/business-logic/board';
import { canComment } from '@trello/business-logic/notification';
import { useBoardId, useWorkspaceId } from '@trello/id-context';
import { useWorkspaceUserLimit } from '@trello/workspaces/user-limit';

import { useBoardOrganizationPermissionsContextFragment } from './BoardOrganizationPermissionsContextFragment.generated';
import { useBoardPermissionsContextFragment } from './BoardPermissionsContextFragment.generated';
import { canCopy } from './canCopy';
import { canVote } from './canVote';
import { useMemberPermissionsContextFragment } from './MemberPermissionsContextFragment.generated';

export interface BoardPermissionsContextValue {
  canEditBoard: boolean;
  canRenameBoard: boolean;
  canCommentOnBoard: boolean;
  canVoteOnBoard: boolean;
  canCopyBoard: boolean;
  canDeleteBoard: boolean;
}

const defaultContextValue: BoardPermissionsContextValue = {
  canEditBoard: false,
  canRenameBoard: false,
  canCommentOnBoard: false,
  canVoteOnBoard: false,
  canCopyBoard: false,
  canDeleteBoard: false,
};

export const BoardPermissionsContext =
  createContext<BoardPermissionsContextValue>(defaultContextValue);

export const BoardPermissionsContextProvider: FunctionComponent<
  PropsWithChildren<unknown>
> = ({ children }) => {
  const workspaceId = useWorkspaceId();
  const boardId = useBoardId();
  const memberId = useMemberId();

  let contextValue = defaultContextValue;

  const { isWorkspaceReadOnly } = useWorkspaceUserLimit({
    workspaceId,
  });

  const { data: board } = useBoardPermissionsContextFragment({
    from: {
      id: boardId,
    },
  });

  const { data: boardOrg } = useBoardOrganizationPermissionsContextFragment({
    from: {
      id: boardId,
    },
  });

  const { data: member } = useMemberPermissionsContextFragment({
    from: {
      id: memberId,
    },
  });

  const doesBoardAndMemberExist = !!board && !!member;

  const workspace = boardOrg?.organization ?? null;
  const enterprise = workspace?.enterprise ?? null;

  let canEditBoard = false;
  let canRenameBoard = false;
  let canCommentOnBoard = false;
  let canVoteOnBoard = false;
  let canCopyBoard = false;
  let canDeleteBoard = false;

  if (doesBoardAndMemberExist && !isWorkspaceReadOnly) {
    canEditBoard = canEdit(member, board, workspace, enterprise);
    canRenameBoard =
      !board.closed && canRename(member, board, workspace, enterprise);
    canCommentOnBoard = canComment(member, board, workspace);
    canVoteOnBoard = canVote(member, board, workspace);
    canDeleteBoard = canDelete(member, board, workspace || undefined);
  }

  canCopyBoard =
    doesBoardAndMemberExist && canCopy(member, board, workspace, enterprise);

  contextValue = useMemo(
    () => ({
      canEditBoard,
      canRenameBoard,
      canCommentOnBoard,
      canVoteOnBoard,
      canCopyBoard,
      canDeleteBoard,
    }),
    [
      canEditBoard,
      canRenameBoard,
      canCommentOnBoard,
      canVoteOnBoard,
      canCopyBoard,
      canDeleteBoard,
    ],
  );

  // If not for the need to memoize the context value, we could have done this bail out sooner
  // TODO - m.f: revisit after React Compiler is added
  if (!doesBoardAndMemberExist) {
    contextValue = defaultContextValue;
  }

  return (
    <BoardPermissionsContext.Provider value={contextValue}>
      {children}
    </BoardPermissionsContext.Provider>
  );
};
