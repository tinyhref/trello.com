import { isMemberLoggedIn } from '@trello/authentication';
import type { ProductId } from '@trello/paid-account';
import { Products } from '@trello/paid-account';

import { useNuSkuTeamBusinessClassPricesQuery } from './NuSkuTeamBusinessClassPricesQuery.generated';
import { useNuSkuTeamStandardPricesQuery } from './NuSkuTeamStandardPricesQuery.generated';
import type { BillingQuotes } from './types';

/**
 * Queries the monthly and annual pricing data for different Trello tiers on the plan comparison
 * @param teamId
 * @param standardVariation
 */
export const usePricingTierQuery = (
  teamId: string,
): {
  billingQuote: BillingQuotes;
  isLoadingPricingTierQuery?: boolean;
} | null => {
  const premiumProductCode = Products.Organization.Premium.current.yearly;

  const { data: businessQuoteData, loading: loadingBusinessData } =
    useNuSkuTeamBusinessClassPricesQuery({
      variables: {
        orgId: teamId,
        product: premiumProductCode,
      },
      skip: !isMemberLoggedIn(),
      waitOn: ['None'],
    });
  const standardProductCode: number = Products.Organization.Standard.v1.yearly;

  const { data: standardQuoteData, loading: loadingStandardQuote } =
    useNuSkuTeamStandardPricesQuery({
      variables: {
        orgId: teamId,
        product: standardProductCode,
      },
      skip: !isMemberLoggedIn(),
      waitOn: ['None'],
    });

  const isPricingTierQueryLoading = loadingStandardQuote || loadingBusinessData;

  if (
    !isPricingTierQueryLoading &&
    (!businessQuoteData?.newSubscriptionListPriceQuotes ||
      !standardQuoteData?.newSubscriptionListPriceQuotes)
  )
    return null;

  const bcMonthly =
    businessQuoteData?.newSubscriptionListPriceQuotes?.base.monthly;
  const bcAnnual =
    businessQuoteData?.newSubscriptionListPriceQuotes?.base.annual;
  const staMonthly =
    standardQuoteData?.newSubscriptionListPriceQuotes?.base.monthly;
  const staAnnual =
    standardQuoteData?.newSubscriptionListPriceQuotes?.base.annual;

  return {
    isLoadingPricingTierQuery: isPricingTierQueryLoading,
    billingQuote: {
      businessPrices: {
        monthly: {
          productCode: bcMonthly?.ixSubscriptionProduct as
            | ProductId
            | undefined,
          subTotalPerUser: bcMonthly?.nSubtotalPerUser,
          subTotal: bcMonthly?.nSubtotal,
        },
        annual: {
          productCode: bcAnnual?.ixSubscriptionProduct as ProductId | undefined,
          subTotalPerUser: bcAnnual?.nSubtotalPerUser,
          subTotal: bcAnnual?.nSubtotal,
        },
      },
      standardPrices: {
        monthly: {
          productCode: staMonthly?.ixSubscriptionProduct as
            | ProductId
            | undefined,
          subTotalPerUser: staMonthly?.nSubtotalPerUser,
          subTotal: staMonthly?.nSubtotal,
        },
        annual: {
          productCode: staAnnual?.ixSubscriptionProduct as
            | ProductId
            | undefined,
          subTotalPerUser: staAnnual?.nSubtotalPerUser,
          subTotal: staAnnual?.nSubtotal,
        },
      },
    },
  };
};
