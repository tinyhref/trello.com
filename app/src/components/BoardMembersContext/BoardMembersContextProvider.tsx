import type { FunctionComponent, PropsWithChildren } from 'react';
import { useMemo } from 'react';

import { useBoardMembers } from '@trello/business-logic-react/board';
import { useBoardId } from '@trello/id-context';

import { BoardMembersContext } from './BoardMembersContext';

export const BoardMembersContextProvider: FunctionComponent<
  PropsWithChildren<unknown>
> = ({ children }) => {
  const boardId = useBoardId();
  const {
    isAdmin,
    isMemberDeactivated,
    isMember,
    isMemberOfOrganization,
    canDeleteCommentFromMember,
    admins,
    canRemoveBoardMember,
    members,
  } = useBoardMembers(boardId);

  const value = useMemo(
    () => ({
      admins,
      canDeleteCommentFromMember,
      canRemoveBoardMember,
      isAdmin,
      isMember,
      isMemberDeactivated,
      isMemberOfOrganization,
      members,
    }),
    [
      admins,
      canDeleteCommentFromMember,
      canRemoveBoardMember,
      isAdmin,
      isMember,
      isMemberDeactivated,
      isMemberOfOrganization,
      members,
    ],
  );

  return (
    <BoardMembersContext.Provider value={value}>
      {children}
    </BoardMembersContext.Provider>
  );
};
