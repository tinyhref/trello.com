import { createContext } from 'use-context-selector';

import type { Member } from '@trello/business-logic-react/board';

export interface BoardMembersContextValue {
  admins: Member[];
  members: Member[];
  canDeleteCommentFromMember: (memberId: string) => boolean;
  canRemoveBoardMember: (memberId: string) => boolean;
  isAdmin: (memberId: string) => boolean;
  isMember: (memberId: string) => boolean;
  isMemberDeactivated: (memberId: string) => boolean;
  isMemberOfOrganization: (memberId: string) => boolean;
}

export const emptyBoardMembersContext: BoardMembersContextValue = {
  admins: [],
  members: [],
  canDeleteCommentFromMember: () => false,
  canRemoveBoardMember: () => false,
  isAdmin: () => false,
  isMember: () => false,
  isMemberDeactivated: () => false,
  isMemberOfOrganization: () => false,
};

export const BoardMembersContext = createContext<BoardMembersContextValue>(
  emptyBoardMembersContext,
);
