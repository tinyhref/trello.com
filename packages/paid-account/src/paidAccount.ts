import type { BillingDates, ExpirationDates, ScheduledChange } from './types';

function isJsonString(str: unknown) {
  if (typeof str === 'string' || str instanceof String) {
    try {
      JSON.parse(str as string);
    } catch (e) {
      return false;
    }
    return true;
  } else {
    return false;
  }
}

/**
 * Get the next billing date for the given paidAccount
 * object. Looks up the date string for the product
 * and converts it to a Date. Returns null if not
 * applicable
 */
export const getNextBillingDate = (
  paidAccount?: {
    products: number[];
    billingDates?: BillingDates | string | null;
  } | null,
): Date | null => {
  const product = paidAccount?.products?.[0];
  const billingDates = isJsonString(paidAccount?.billingDates)
    ? JSON.parse(paidAccount?.billingDates as string)
    : paidAccount?.billingDates;
  if (
    !product ||
    !billingDates ||
    !Object.prototype.hasOwnProperty.call(billingDates, product)
  ) {
    return null;
  }
  return new Date(billingDates[product]);
};

/**
 * Get the expiration date for a give paidAccount
 * object. Looks up the date string for the product
 * and converts it to a Date. Returns null if not
 * applicable
 */
export const getExpirationDate = (
  paidAccount?: {
    products: number[];
    expirationDates?: ExpirationDates | null;
  } | null,
): Date | null => {
  const product = paidAccount?.products?.[0];
  const expirationDates = paidAccount?.expirationDates;
  if (
    !product ||
    !expirationDates ||
    !Object.prototype.hasOwnProperty.call(expirationDates, product)
  ) {
    return null;
  }
  return new Date(expirationDates[product]);
};

/**
 * Check if a subscription is pending cancellation. Prefer
 * using `scheduledChange` as it distinguishes cancellations
 * from downgrades. If it is not present, fall back to
 * seeing if there is an expiration date on the product
 * subscription.
 */
export const isPendingCancellation = (
  paidAccount?: {
    products: number[];
    expirationDates: ExpirationDates;
    scheduledChange?: ScheduledChange | null;
  } | null,
): boolean => {
  const { scheduledChange } = paidAccount ?? {};

  if (scheduledChange?.nextChangeTimestamp) {
    return !scheduledChange.ixSubscriptionProduct;
  }

  return !!getExpirationDate(paidAccount);
};
