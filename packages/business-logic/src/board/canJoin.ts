import type {
  Board,
  Enterprise,
  Member,
  Organization,
} from '@trello/model-types';

import { getMembership } from '../membership/getMembership';
import { isMemberOfOrganization } from '../organization/isMemberOfOrganization';
import { isPremOrganizationAdmin } from '../organization/isPremOrganizationAdmin';
import { allowsSelfJoin } from './allowsSelfJoin';

/**
 * This ports the `canJoin` method from `app/scripts/models/Board`, which
 * relied on model cache data.
 */
export const canJoin = (
  member: Pick<
    Member,
    'id' | 'idEnterprisesAdmin' | 'idPremOrgsAdmin' | 'memberType'
  >,
  board: {
    idEnterprise?: string | null;
    memberships: Pick<
      Board['memberships'][number],
      'id' | 'idMember' | 'memberType'
    >[];
    organization?: Pick<Board['organization'], 'id'> | null;
    prefs?: Pick<Board['prefs'], 'isTemplate' | 'selfJoin'> | null;
  },
  workspace:
    | (Pick<Organization, 'id' | 'offering'> & {
        idEnterprise?: string | null;
        enterprise?: Pick<Organization['enterprise'], 'id'> | null;
        memberships: Pick<
          Organization['memberships'][number],
          'deactivated' | 'id' | 'idMember' | 'memberType' | 'unconfirmed'
        >[];
      })
    | null,
  enterprise: (Pick<Enterprise, 'idAdmins'> & { id: string }) | null,
) => {
  if (!workspace && !board.idEnterprise) {
    return false;
  }

  // Any board member type (admin, normal, or observer) can't join a board
  const memberType = getMembership(board.memberships, member.id);
  if (memberType) {
    return false;
  }

  const isPremOrgAdmin =
    workspace && isPremOrganizationAdmin(member, workspace.id);
  const selfJoin = allowsSelfJoin(board);

  const isEnterpriseBoard =
    !!board.idEnterprise || (workspace && !!workspace.enterprise);

  const isOrgMember =
    workspace && isMemberOfOrganization(member, workspace, enterprise);
  return (
    isPremOrgAdmin ||
    (selfJoin && isOrgMember) ||
    (isEnterpriseBoard &&
      enterprise &&
      enterprise.idAdmins?.includes(member.id))
  );
};
