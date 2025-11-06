import { isPremOrganizationAdmin } from '@trello/business-logic/organization';
import type { Member, Organization } from '@trello/model-types';

import { isEnterpriseAdmin } from './isEnterpriseAdmin';

export const isWorkspaceAdmin = (
  member: Pick<Member, 'idEnterprisesAdmin' | 'idPremOrgsAdmin'> & {
    organizations: (Pick<Organization, 'id'> & {
      idEnterprise?: string | null;
    })[];
  },
  idEnterprise: string,
) => {
  if (isEnterpriseAdmin(member, idEnterprise)) {
    // ent admins are always team admins
    return true;
  }
  return (
    !!member &&
    member.organizations.some(
      (workspace) =>
        workspace.idEnterprise === idEnterprise &&
        isPremOrganizationAdmin(member, workspace.id),
    )
  );
};
