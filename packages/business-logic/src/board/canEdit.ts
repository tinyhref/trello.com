import type { Board, Member } from '@trello/model-types';

import { isAdminOfOrganization } from '../organization/isAdminOfOrganization';
import type { isMemberOfOrganization } from '../organization/isMemberOfOrganization';
import { getMemberTypeFromBoard } from './getMemberTypeFromBoard';
import { isEditableByOrganizationMember } from './isEditableByOrganizationMember';

/**
 * Checks if a member has edit permissions on the board.
 */
export const canEdit = (
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
    closed: boolean;
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
  enterprise: Parameters<typeof isMemberOfOrganization>[2] | null,
) => {
  if (board.closed) {
    return false;
  }

  const memberType = getMemberTypeFromBoard(member, board, organization);

  const isWorkspaceAdmin =
    organization && isAdminOfOrganization(member, organization, enterprise);

  if ('observer' === memberType && !isWorkspaceAdmin) {
    return false;
  }

  // existing board members can edit
  if (['admin', 'normal'].includes(memberType)) {
    return true;
  }

  return isEditableByOrganizationMember(member, board, organization);
};
