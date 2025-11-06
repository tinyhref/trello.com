import { Entitlements } from '@trello/entitlements';
import { sendErrorEvent } from '@trello/error-reporting';

import { useUpgradePromptOrganizationDataQuery } from './UpgradePromptOrganizationDataQuery.generated';

/*
 * Finds product information based on orgId
 */
export const useProductData = (
  orgId: string,
  options: { skip: boolean } = { skip: false },
) => {
  const { data, error, loading } = useUpgradePromptOrganizationDataQuery({
    variables: { orgId },
    skip: !orgId || options.skip,
    waitOn: ['MemberHeader', 'MemberBoards'],
  });

  const isStandard = Entitlements.isStandard(data?.organization?.offering);
  const isPremium = Entitlements.isPremium(data?.organization?.offering);
  const isEnterprise = Entitlements.isEnterprise(data?.organization?.offering);
  const isFree = Entitlements.isFree(data?.organization?.offering);

  if (error)
    sendErrorEvent(error, {
      tags: { ownershipArea: 'trello-web-eng' },
    });

  return {
    isFree,
    isStandard,
    isPremium,
    isEnterprise,
    premiumFeatures: data?.organization?.premiumFeatures ?? [],
    idEntitlement: data?.organization?.idEntitlement,
    loading,
  };
};
