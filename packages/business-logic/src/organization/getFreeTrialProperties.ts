import { differenceInHours, isAfter } from 'date-fns';

import { idToDate } from '@trello/dates';
import { Entitlements } from '@trello/entitlements';

export interface Credit {
  id: string;
  count: number;
  type: string;
}

export interface PaidAccount {
  trialExpiration?: string | null;
}

interface FreeTrialProperties {
  isActive: boolean;
  expiresAt: Date;
  isExpired: boolean;
  days: number;
  daysLeft: number | null;
  startDate: Date;
  credit: Credit;
}

/**
 * Returns details about the user's free trial period, if applicable.
 */
export const getFreeTrialProperties = (
  credits: Credit[],
  offering: string,
  trialExpiration?: string | null,
): FreeTrialProperties | null => {
  const freeTrialCredit = credits
    .slice()
    .sort((a, b) => (b.id > a.id ? 1 : -1)) // to get the most recent free trial credit
    .find((credit) => credit.type === 'freeTrial');

  if (!freeTrialCredit) {
    return null;
  }

  const promoCodeCredit = credits
    .slice()
    .sort((a, b) => (b.id > a.id ? 1 : -1))
    .find((credit) => credit.type === 'promoCode');

  const startDate = idToDate(freeTrialCredit.id);
  const days = freeTrialCredit.count;

  // endDate is the start date of the credit + the count (free trial length in days)
  // This is a backup for when the workpace paidAccount.trialExpiration is unavailable (ex: for non-admins)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);

  const expiresAt = new Date(trialExpiration || endDate);
  const daysLeft = expiresAt
    ? Math.ceil(differenceInHours(expiresAt, new Date()) / 24)
    : null;
  // If there is a promo code credit that outlasts the freeTrial, we should not show the free trial banner
  if (promoCodeCredit) {
    const promoCodeStartDate = idToDate(promoCodeCredit.id);
    // Promo code credits are in months, so we need to convert to days
    const promoCodeDays = promoCodeCredit.count * 30;
    const promoCodeEndDate = new Date(promoCodeStartDate);
    promoCodeEndDate.setDate(promoCodeStartDate.getDate() + promoCodeDays);
    if (isAfter(promoCodeEndDate, endDate)) {
      return null;
    }
  }

  const isActive =
    daysLeft !== null && daysLeft > 0 && Entitlements.isPremium(offering);
  return {
    isActive,
    expiresAt,
    isExpired: !!freeTrialCredit && !isActive,
    days,
    daysLeft,
    startDate,
    credit: freeTrialCredit,
  };
};
