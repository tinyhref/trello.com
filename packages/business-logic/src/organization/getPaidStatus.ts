import { Entitlements } from '@trello/entitlements';

/**
 * Returns paid status of a product for analytics.
 */
export const getPaidStatus = (offering: string) => {
  return Entitlements.isEnterprise(offering)
    ? 'enterprise'
    : Entitlements.isStandard(offering)
      ? 'standard'
      : Entitlements.isPremium(offering)
        ? 'bc'
        : 'free';
};
