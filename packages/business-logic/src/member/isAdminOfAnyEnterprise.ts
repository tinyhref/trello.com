import type { Member, Organization } from '@trello/model-types';

import { isAdminOfEnterprise } from './isAdminOfEnterprise';

export const isAdminOfAnyEnterprise = (
  member: Pick<Member, 'id' | 'idEnterprisesAdmin' | 'idPremOrgsAdmin'> & {
    idEnterprise?: string | null;
  },
  organizations: (Pick<Organization, 'id'> & {
    idEnterprise?: string | null;
  })[],
) => {
  if (member.idEnterprise && isAdminOfEnterprise(member, member.idEnterprise)) {
    return true;
  }

  const organizationMap = new Map<
    string,
    Pick<Organization, 'id'> & {
      idEnterprise?: string | null;
    }
  >();
  for (const organization of organizations) {
    organizationMap.set(organization.id, organization);
  }

  return member.idPremOrgsAdmin.some(
    (idOrganization) =>
      organizationMap.get(idOrganization)?.idEnterprise === member.idEnterprise,
  );
};
