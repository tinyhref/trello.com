import { Entitlements } from '@trello/entitlements';

interface Enterprise {
  id: string;
  offering: string;
}

interface EnterpriseLicense {
  idEnterprise: string;
}

/**
 * Returns whether member is managed and licensed by a real enterprise
 * @param idEnterprise The members idEnterprise
 * @param enterprises Array of enterprises on the member
 * @param enterpriseLicenses Array of member's enterprise licenses
 * @returns Boolean
 */
export const isLicensedManaged = (
  memberIdEnterprise: string,
  enterprises: Enterprise[],
  enterpriseLicenses: EnterpriseLicense[],
) => {
  const managingEnterprise = enterprises.find(
    ({ id }) => id === memberIdEnterprise,
  );

  if (
    !managingEnterprise ||
    !Entitlements.isEnterprise(managingEnterprise.offering)
  ) {
    return false;
  }

  return enterpriseLicenses.some(
    ({ idEnterprise }) => idEnterprise === managingEnterprise.id,
  );
};
