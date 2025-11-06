/* eslint-disable formatjs/enforce-description */
import { type ApolloError } from '@apollo/client';
import { useDebounce } from 'use-debounce';

import { intl } from '@trello/i18n';
import { localizeCount } from '@trello/legacy-i18n';
import { asMoney } from '@trello/legacy-i18n/formatters';
import {
  getPriceQuoteForProduct,
  ProductFeatures,
  Products,
} from '@trello/paid-account';
import type { PIIString } from '@trello/privacy';

import { requiresZipCode } from 'app/src/components/CreditCardForm/taxes';
import { useListPricesQuery } from './ListPricesQuery.generated';
import { type PlanSummaryProps } from './PlanSummary';
import { usePriceQuotesQuery } from './PriceQuotesQuery.generated';

export interface PlanSummaryCalculationProps {
  country?: PIIString;
  includeUnconfirmed?: boolean;
  product: number;
  taxId?: string | null;
  stateTaxId?: string | null;
  workspaceId: string;
  zipCode?: PIIString;
  isVatRegistered?: boolean | null;
  onError?: (error: ApolloError) => void;
}

/**
 * Get annual product SKU for price quotes query
 * for the given product (if not already annual)
 */
const getAnnualProduct = (product: number): number =>
  (ProductFeatures.isYearly(product)
    ? product
    : ProductFeatures.getYearlyEquivalent(product)) ??
  Products.Organization.Premium.current.yearly;

const getLicenseDescription = (
  licenseCount: number,
  subtotalPerUser: number,
  isAnnual: boolean,
): { numberOfLicenses: string; pricePerLicense: string } => ({
  numberOfLicenses: localizeCount(
    isAnnual ? 'yearly-licenses' : 'monthly-licenses',
    licenseCount,
  ),
  pricePerLicense: intl.formatMessage(
    {
      id: 'templates.credit_card.amount-each',
      defaultMessage: '${amount} USD each',
    },
    { amount: asMoney(subtotalPerUser) },
  ),
});

export const usePlanSummaryCalculation = ({
  country,
  isVatRegistered,
  includeUnconfirmed = false,
  product,
  stateTaxId,
  taxId,
  workspaceId,
  zipCode,
  onError,
}: PlanSummaryCalculationProps): PlanSummaryProps => {
  const [debouncedZipCode] = useDebounce(zipCode, 750);
  const [debouncedTaxId] = useDebounce(taxId, 750);
  const [debouncedStateTaxId] = useDebounce(stateTaxId, 750);
  const { data: listPriceData, loading: listPriceLoading } = useListPricesQuery(
    {
      variables: {
        accountId: workspaceId,
        includeUnconfirmed,
        product: getAnnualProduct(product),
      },
      waitOn: ['None'],
    },
  );

  const {
    data: priceQuotesData,
    loading: priceQuotesLoading,
    error: priceQuotesError,
  } = usePriceQuotesQuery({
    variables: {
      accountId: workspaceId,
      includeUnconfirmed,
      country: country!,
      postalCode: debouncedZipCode,
      product: getAnnualProduct(product),
      stateTaxId: debouncedStateTaxId,
      taxId: debouncedTaxId,
      isVatRegistered: !!isVatRegistered,
    },
    // This should never read from cache as it calculates up-to-the-second pricing information
    // eslint-disable-next-line @trello/disallow-fetch-policies
    fetchPolicy: 'network-only',
    skip: !country || (requiresZipCode(country) && !debouncedZipCode),
    waitOn: ['None'],
    onError: (error) => onError?.(error),
  });

  if (listPriceLoading || !listPriceData) {
    return {
      country,
      zipCode,
      pendingInvitations: 0,
      userCount: 0,
      billableCollaboratorCount: 0,
      licenseDescriptionObj: {
        numberOfLicenses: '0',
        pricePerLicense: '0',
      },
      tax: 0,
      taxRegion: '',
      priceAdjustment: 1,
      subtotal: 0,
      adjustedSubtotal: 0,
      subtotalPerUser: 0,
      adjustedSubtotalPerUser: 0,
      total: 0,
      calculationError: false,
    };
  }

  const pendingInvitations = (
    listPriceData?.organization?.memberships ?? []
  ).reduce(
    (count, membership) => (membership.unconfirmed ? count + 1 : count),
    0,
  );

  const isAnnual = ProductFeatures.isYearly(product);
  const baseQuote = getPriceQuoteForProduct(
    product,
    listPriceData.newSubscriptionListPriceQuotes.base,
  )!;
  const productQuote =
    (!priceQuotesLoading &&
      !priceQuotesError &&
      getPriceQuoteForProduct(
        product,
        priceQuotesData?.newSubscriptionPriceQuotes,
      )) ||
    getPriceQuoteForProduct(
      product,
      listPriceData.newSubscriptionListPriceQuotes.subscriber,
    );

  const userCount = productQuote?.cTeamMembers ?? baseQuote.cTeamMembers;
  const billableCollaboratorCount =
    productQuote?.cBillableCollaborators ?? baseQuote.cBillableCollaborators;
  const tax = productQuote?.nTax ?? 0;
  const taxRegion = productQuote?.sTaxRegion ?? '';
  const priceAdjustment = productQuote?.nPricingAdjustment ?? 1;
  const subtotal = baseQuote.nSubtotal ?? 0;
  const subtotalPerUser = baseQuote.nSubtotalPerUser ?? 0;
  const adjustedSubtotal = productQuote?.nSubtotal ?? baseQuote.nSubtotal;
  const adjustedSubtotalPerUser =
    productQuote?.nSubtotalPerUser ?? baseQuote.nSubtotalPerUser;
  const total = productQuote?.nTotal ?? baseQuote.nTotal;

  return {
    country,
    zipCode,
    pendingInvitations,
    userCount,
    billableCollaboratorCount,
    licenseDescriptionObj: getLicenseDescription(
      userCount + billableCollaboratorCount,
      subtotalPerUser,
      isAnnual,
    ),
    tax,
    taxRegion,
    priceAdjustment,
    subtotal,
    adjustedSubtotal,
    subtotalPerUser,
    adjustedSubtotalPerUser,
    total,
    calculationError: !!priceQuotesError,
    isAnnual,
  };
};
