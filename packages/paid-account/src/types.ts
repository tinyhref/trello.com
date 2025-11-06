/* eslint-disable @trello/disallow-filenames */
/**
 * These are the standings actively used by Aardvark
 * for Trello product subscriptions
 */
type ActivelyUsedStandings = 3 | 4 | 5;

/**
 * Standing 2 (Denied) was deprecated by Aardvark around 2015
 *
 * Standing 0 (New) is used internally in Aardvark, but shouldn't
 *   ever be exposed as far as web. There are instances of it in the
 *   database, however, so we'll acknowledge it
 *
 * Standing -1 (None) is used internally in web and server to
 *   designate a lack of an account. Not used in Aardvark at all
 */
type DeprecatedOrRareStanding = -1 | 0 | 2 | 6;

export type Standing = ActivelyUsedStandings | DeprecatedOrRareStanding;

export interface ScheduledChange {
  nextChangeTimestamp: string;
  ixSubscriptionProduct?: number | null;
}

export interface BillingDates {
  [productCode: number]: string;
}

export interface ExpirationDates {
  [productCode: number]: string;
}

import type { ProductId } from './products/ids';

export const ProductFamily = {
  Standard: 'STANDARD',
  Premium: 'PREMIUM',
  Enterprise: 'ENTERPRISE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ProductFamily = (typeof ProductFamily)[keyof typeof ProductFamily];

export const ProductName = {
  Enterprise: 'Enterprise',
  Enterprise1x1: 'Enterprise v1.1',
  Enterprise1x2: 'Enterprise v1.2',
  Enterprise2x0: 'Enterprise v2.0',
  Enterprise2x1: 'Enterprise v2.1',
  Enterprise2x2: 'Enterprise v2.2',
  Premium: 'Premium',
  Standard: 'Standard',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ProductName = (typeof ProductName)[keyof typeof ProductName];

export const ProductShortName = {
  Enterprise: 'enterprise',
  Enterprise1x1TieredPricing: 'enterprise1x1TieredPricing',
  Enterprise1x2SiteLicense: 'enterprise1x2SiteLicense',
  Enterprise2x0TieredPricing: 'enterprise2x0TieredPricing',
  Enterprise2x1SiteLicense: 'enterprise2x1SiteLicense',
  Enterprise2x2Together: 'enterprise2x2Together',
  Premium: 'premium',
  StandardMonthly: 'standardMonthly',
  StandardYearly: 'standardYearly',
  StandardMonthly2: 'standardMonthly2',
  StandardYearly2: 'standardYearly2',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ProductShortName =
  (typeof ProductShortName)[keyof typeof ProductShortName];

export const ProductInterval = {
  Monthly: 'monthly',
  Yearly: 'yearly',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ProductInterval =
  (typeof ProductInterval)[keyof typeof ProductInterval];

export interface Product {
  id: ProductId;
  family: ProductFamily;
  shortName: ProductShortName;
  name: ProductName;
  interval?: ProductInterval;
  hidden?: boolean;
  current: boolean;
  perUser: boolean;
  prebill: boolean;
  purchaseOrder?: boolean;
  upgrade?: boolean;
  yearlyEquivalent?: ProductId;
  bcUpgradeProduct?: ProductId; // used for upgrading Standard to BC
  updateProduct?: ProductId; // used for updating sunsetted product
}

export type ProductDesc = ProductId | ProductShortName | number | string;
