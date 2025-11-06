import type { Board } from '@trello/model-types';

export const isMemberOfBoard = <
  TInputBoard extends {
    memberships?: Pick<Board['memberships'][number], 'idMember'>[] | null;
  },
>(
  board: TInputBoard,
  idMember: string,
): boolean => {
  // There are cases where `memberships` are returning null
  // and are not caught by typescript
  // TODO investigate how board.memberships can be null and why
  // typescript is not catching these errors
  if (!board.memberships) {
    return false;
  }

  return board.memberships.some(
    (membership) => membership.idMember === idMember,
  );
};
