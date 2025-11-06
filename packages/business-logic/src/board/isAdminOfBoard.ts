import type { Board, Member } from '@trello/model-types';

import { isMemberTypeOfBoard } from './isMemberTypeOfBoard';

/**
 * Checks if a member has admin access to the board.
 */
export const isAdminOfBoard = (
  member: Pick<Member, 'id' | 'idPremOrgsAdmin' | 'memberType'> & {
    idEnterprisesAdmin?: string[] | null;
  },
  board: {
    memberships: Pick<
      Board['memberships'][number],
      'deactivated' | 'idMember' | 'memberType' | 'unconfirmed'
    >[];
    organization?:
      | (Pick<Board['organization'], 'id' | 'offering'> & {
          memberships: (Pick<
            Board['organization']['memberships'][number],
            'deactivated' | 'idMember' | 'memberType' | 'unconfirmed'
          > & {
            id?: string;
          })[];
        })
      | null
      | undefined;
  },
  implicitAdmin = true,
) => {
  return isMemberTypeOfBoard(
    member,
    board,
    board.organization,
    'admin',
    implicitAdmin,
  );
};
