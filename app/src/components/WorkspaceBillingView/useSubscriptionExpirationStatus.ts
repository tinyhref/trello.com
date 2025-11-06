import { differenceInHours } from 'date-fns';

import type { ExpirationDates } from '@trello/paid-account';
import {
  getExpirationDate,
  isActive,
  isCancelled,
  needsCC,
  ProductFeatures,
} from '@trello/paid-account';

import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial';

export interface ExpirationStatus {
  hasActivePaidAccount: boolean;
  paidPlanExpired: boolean;
  paidPlanDisabled: boolean;
  planType: 'bc' | 'standard';
  planExpirationDate: Date | null;
  freeTrialExpired: boolean;
  freeTrialExpirationDate: Date | null;
}

interface PreviousSubscription {
  ixSubscriptionProductId: number;
  dtCancelled: string;
}

interface PaidAccount {
  standing: number;
  expirationDates: ExpirationDates;
  products: number[];
  dateFirstSubscription: string | null;
  previousSubscription?: PreviousSubscription | null;
  trialType?: string | null;
  trialExpiration?: string | null;
}

export const useSubscriptionExpirationStatus = ({
  orgId,
  paidAccount,
}: {
  orgId: string;
  paidAccount?: PaidAccount | null;
}): ExpirationStatus => {
  const hasActivePaidAccount = Boolean(paidAccount && isActive(paidAccount));

  const previousSubscriptionProduct =
    paidAccount?.previousSubscription?.ixSubscriptionProductId;
  const previousIsFreeTrial =
    previousSubscriptionProduct &&
    paidAccount?.trialType === 'freeTrial' &&
    paidAccount?.trialExpiration &&
    paidAccount?.previousSubscription?.dtCancelled &&
    differenceInHours(
      new Date(paidAccount?.previousSubscription?.dtCancelled),
      new Date(paidAccount?.trialExpiration),
    ) <= 25;

  const planExpired = Boolean(paidAccount && isCancelled(paidAccount));
  const paidPlanDisabled = Boolean(
    paidAccount && needsCC(paidAccount.standing),
  );
  const planType =
    previousSubscriptionProduct &&
    ProductFeatures.isStandardProduct(previousSubscriptionProduct)
      ? 'standard'
      : 'bc';
  const planExpirationDate = getExpirationDate(paidAccount);

  const { endDate: freeTrialExpirationDate } =
    useFreeTrialEligibilityRules(orgId);

  const freeTrialExpired = !!(planExpired && previousIsFreeTrial);
  const paidPlanExpired = !!(planExpired && !previousIsFreeTrial);

  return {
    hasActivePaidAccount,
    paidPlanExpired,
    paidPlanDisabled,
    planType,
    planExpirationDate,
    freeTrialExpired,
    freeTrialExpirationDate,
  };
};
