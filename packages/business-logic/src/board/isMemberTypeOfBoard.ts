import type { Board, Member } from '@trello/model-types';

import { getMemberTypeFromBoard } from './getMemberTypeFromBoard';
import type { MemberType } from './memberType.types';

export const isMemberTypeOfBoard = (
  member: Pick<Member, 'id' | 'idPremOrgsAdmin' | 'memberType'> & {
    idEnterprisesAdmin?: string[] | null;
  },
  board: {
    memberships: Pick<
      Board['memberships'][number],
      'deactivated' | 'idMember' | 'memberType' | 'unconfirmed'
    >[];
  },
  organization:
    | (Pick<Board['organization'], 'id' | 'offering'> & {
        memberships: (Pick<
          Board['organization']['memberships'][number],
          'deactivated' | 'idMember' | 'memberType' | 'unconfirmed'
        > & {
          id?: string;
        })[];
        enterprise?: {
          id?: Board['organization']['enterprise']['id'];
          idAdmins?: Board['organization']['enterprise']['idAdmins'];
        } | null;
      })
    | null
    | undefined,
  memberType: MemberType,
  implicitAdmin = true,
) => {
  return (
    getMemberTypeFromBoard(member, board, organization, implicitAdmin) ===
    memberType
  );
};
