import { Entitlements } from '@trello/entitlements';

export interface EnterpriseData {
  idEnterprise: string | undefined;
  idEnterprises: string[];
  inEnterprise: boolean | undefined;
  inRealEnterprise: boolean | undefined;
  hasEnterpriseDomain: boolean | undefined;
}
export interface EnterpriseMemberData {
  id: string;
  enterprises: Array<{
    id: string;
    offering: string;
  }>;
  hasEnterpriseDomain?: boolean | null;
  idEnterprise?: string | null;
}
/**
 * Transforms raw member enterprise data into a standardized format
 * @param memberData - The raw member data containing enterprise information
 * @returns A standardized enterprise data object
 */
export const getEnterpriseData = (
  memberData: EnterpriseMemberData | undefined,
): EnterpriseData => {
  return {
    idEnterprise: memberData?.idEnterprise || undefined,
    idEnterprises: memberData?.enterprises?.map(({ id }) => id) || [],
    inEnterprise: (memberData?.enterprises || []).length > 0,
    inRealEnterprise: (memberData?.enterprises || []).some((enterprise) =>
      Entitlements.isEnterprise(enterprise.offering),
    ),
    hasEnterpriseDomain: memberData?.hasEnterpriseDomain || false,
  };
};
