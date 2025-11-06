import type { BillingDates } from '@trello/paid-account';
import { getNextBillingDate } from '@trello/paid-account';

export const getBannerMessageName = (
  orgId: string,
  paidAccount: { products: number[]; billingDates?: BillingDates | null },
) => {
  const billingDate = (getNextBillingDate(paidAccount) ?? new Date()).getTime();
  return `OverdueBanner-${orgId}-${billingDate}`;
};
