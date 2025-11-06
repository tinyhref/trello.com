import type { Board, Member } from '@trello/model-types';

import { isMemberOfOrganization } from '../organization/isMemberOfOrganization';
import { isPremOrganizationAdmin } from '../organization/isPremOrganizationAdmin';
import { allowsSelfJoin } from './allowsSelfJoin';
import { isMemberTypeOfBoard } from './isMemberTypeOfBoard';

export const isEditableByOrganizationMember = (
  member: Pick<
    Member,
    'id' | 'idEnterprisesAdmin' | 'idPremOrgsAdmin' | 'memberType'
  >,
  board: {
    prefs?: Pick<Board['prefs'], 'isTemplate' | 'selfJoin'> | null;
    memberships: Pick<
      Board['memberships'][number],
      'deactivated' | 'id' | 'idMember' | 'memberType' | 'unconfirmed'
    >[];
  },
  organization:
    | (Pick<Board['organization'], 'id' | 'offering'> & {
        memberships: Pick<
          Board['organization']['memberships'][number],
          'deactivated' | 'id' | 'idMember' | 'memberType' | 'unconfirmed'
        >[];
        enterprise?: {
          id?: Board['organization']['enterprise']['id'];
          idAdmins?: Board['organization']['enterprise']['idAdmins'];
        } | null;
      })
    | null,
) => {
  if (!organization) {
    return false;
  }

  if (isMemberTypeOfBoard(member, board, organization, 'observer')) {
    return false;
  }

  const isOrgMember = isMemberOfOrganization(member, organization);
  return (
    isPremOrganizationAdmin(member, organization.id) ||
    (allowsSelfJoin(board) && isOrgMember)
  );
};
