import type { Board, Member } from '@trello/model-types';

import { getMemberTypeFromBoard } from './getMemberTypeFromBoard';
import { getMyBoards } from './getMyBoards';

export const getMyOwnedBoards = <
  TMember extends Pick<
    Member,
    'id' | 'idBoards' | 'idEnterprisesAdmin' | 'idPremOrgsAdmin' | 'memberType'
  > & {
    boards: {
      id: string;
      memberships: Pick<
        Board['memberships'][number],
        'deactivated' | 'id' | 'idMember' | 'memberType' | 'unconfirmed'
      >[];
      organization?:
        | (Pick<Board['organization'], 'id' | 'offering'> & {
            memberships: Pick<
              Board['organization']['memberships'][number],
              'deactivated' | 'idMember' | 'memberType' | 'unconfirmed'
            >[];
            enterprise?: Pick<
              Board['organization']['enterprise'],
              'idAdmins'
            > | null;
          })
        | null;
    }[];
  },
>(
  member: TMember,
): TMember['boards'] => {
  return getMyBoards(member).filter(
    (board) =>
      getMemberTypeFromBoard(member, board, board?.organization) === 'admin',
  );
};
