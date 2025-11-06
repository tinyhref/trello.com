import type { Board, Member } from '@trello/model-types';

export const getMyBoards = <
  TMember extends Pick<Member, 'id' | 'idBoards'> & {
    boards: {
      id: string;
      memberships: Pick<
        Board['memberships'][number],
        'id' | 'idMember' | 'memberType'
      >[];
    }[];
  },
>(
  member: TMember,
): TMember['boards'] => {
  const inIdBoards = new Map<string, boolean>();
  if (member.idBoards) {
    member.idBoards.forEach((id) => inIdBoards.set(id, true));
  }

  return member.boards.filter(
    ({ id, memberships }) =>
      inIdBoards.get(id) &&
      memberships.some(({ idMember }) => idMember === member.id),
  );
};
