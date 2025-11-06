/**
 * Given an enterprise, and optionally the id of a banner, create a key to use for registering or checking the banner's dismissal.
 * @param enterpriseId Id of the enterprise that has the banner
 * @param bannerId Id for the banner, if present
 * @returns A key to use for the registering or checking the banner's dismissal.
 */
export const createBannerDismissalKey = (enterpriseId: string, bannerId = '') =>
  `enterprise-notification-banner-${enterpriseId}${bannerId}`;
