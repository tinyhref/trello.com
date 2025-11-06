import { sendErrorEvent } from '@trello/error-reporting';
import { deserializeJSONString } from '@trello/graphql';
import type { BillingDates } from '@trello/paid-account';
import { ProductFeatures } from '@trello/paid-account';

import { useAutoRenewalQuery } from 'app/src/components/AutoRenewalQuery/AutoRenewalQuery.generated';

interface StandardPremiumFreeTrialObj {
  loading: boolean;
  isStandardPremiumFreeTrialActive: boolean;
  isAutoUpgrade: boolean;
  billingDates?: BillingDates;
  standardProduct?: number;
  freeTrialProduct?: number;
  prevSubscriptionCancelledDate?: string;
  freeTrialEndDate?: string;
  freeTrialStartDate?: string;
  canRenewCurrentSubscription?: boolean;
}

/**
 * Checks if a standard workspace has premium ft and auto upgradable data.
 * Non-Standard workspaces will return false for premium ft and auto upgrade.
 */
export const useStandardPremiumFreeTrial = (
  accountId: string,
): StandardPremiumFreeTrialObj => {
  const { data, loading, error } = useAutoRenewalQuery({
    variables: {
      orgId: accountId,
    },
    skip: !accountId,
    waitOn: ['MemberHeader', 'MemberBoards'],
  });
  if (error)
    sendErrorEvent(error, {
      tags: { ownershipArea: 'trello-billing-platform' },
    });

  const org = data?.organization;
  const paidAcct = org?.paidAccount;

  const productOverride = paidAcct?.productOverride;

  // Free workspaces with FT don't have the productOverride Object so they aren't eligible for auto upgrades
  if (!productOverride || !data) {
    return {
      loading,
      isAutoUpgrade: false,
      isStandardPremiumFreeTrialActive: false,
    };
  }

  const {
    product: freeTrialProduct,
    dateStart: freeTrialStartDate,
    dateEnd: freeTrialEndDate,
    autoUpgrade: isAutoUpgrade,
  } = productOverride;

  const standardProduct = paidAcct?.paidProduct;
  const canRenewCurrentSubscription = paidAcct?.canRenew;
  const isStandardPremiumFreeTrialActive =
    ProductFeatures.isStandardProduct(standardProduct) &&
    ProductFeatures.isPremiumProduct(freeTrialProduct);

  const prevSubscriptionCancelledDate =
    paidAcct?.previousSubscription?.dtCancelled;

  const billingDates =
    deserializeJSONString<BillingDates>(paidAcct?.billingDates) ?? {};

  return {
    loading,
    billingDates,
    standardProduct,
    prevSubscriptionCancelledDate,
    canRenewCurrentSubscription,
    freeTrialProduct,
    freeTrialEndDate,
    freeTrialStartDate,
    isAutoUpgrade,
    isStandardPremiumFreeTrialActive,
  };
};
