import {
  getMemberTypeFromBoard,
  isMemberOfBoard,
} from '@trello/business-logic/board';
import { isMemberOfOrganization } from '@trello/business-logic/organization';

import type { BoardPermissionsContextQuery } from './BoardPermissionsContextQuery.generated';

type Board = NonNullable<BoardPermissionsContextQuery['board']>;
type Member = NonNullable<BoardPermissionsContextQuery['member']>;
type Organization = NonNullable<
  BoardPermissionsContextQuery['board']
>['organization'];

export const canVote = (
  member: Member,
  board: Board,
  organization?: Organization | null,
): boolean => {
  const hasSuperAdmins =
    board.premiumFeatures?.includes('superAdmins') ?? false;
  const memberType = getMemberTypeFromBoard(
    member,
    board,
    organization,
    hasSuperAdmins,
  );

  const isBoardClosed = board.closed;
  const votingPref = board.prefs?.voting;

  if (isBoardClosed || votingPref === 'disabled') {
    return false;
  }

  if (memberType === 'admin' || votingPref === 'public') {
    return true;
  }

  const allowsSelfJoin = board.prefs?.selfJoin && !board.prefs?.isTemplate;
  // Observers are board members, but they don't have vote permission on the 'Members' setting
  let isBoardMember =
    isMemberOfBoard(board, member.id) && memberType !== 'observer';
  const isBoardObserver = memberType === 'observer';
  const isWorkspaceMember = organization
    ? isMemberOfOrganization(member, organization)
    : false;

  // If the board allows self-join, and the member is a workspace member,
  // they have the same effective permissions as a board member.
  if (!isBoardMember && allowsSelfJoin && isWorkspaceMember) {
    isBoardMember = isWorkspaceMember;
  }

  switch (votingPref) {
    case 'org':
      return isBoardMember || isBoardObserver || isWorkspaceMember;
    case 'observers':
      return isBoardMember || isBoardObserver;
    case 'members':
      return isBoardMember;
    default:
      return false;
  }
};
