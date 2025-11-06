import type { SourceType } from '@trello/analytics-types';

import type { ReferrerAttributes } from './getReferrerMarketingAttributes';
import { getSearchParamsMarketingAttributes } from './getSearchParamsMarketingAttributes';
import { scrubMarketingUrl } from './scrubMarketingAnalyticsUrl';

interface BaseAttributes {
  writeKey: string;
  isMarketingEvent: boolean;
  page_path: string;
  page_domain: string;
  page_canonical_url: string;
  page_url: string;
  page_url_parameters?: string;
  page_url_params_json?: string;
}
export type MarketingAttributes = BaseAttributes | ReferrerAttributes;

/**
 * Returns marketing attributes for URLs without PII or UGC on Trello hybrid marketing/product pages. Use in GAS
 * analytics events when `{isMarketingEvent: true}` exists in the attributes : {...}.
 *
 * @example
 * //returns marketing attributes as an object to include with existing attributes.
 * const marketingAttributes = getMarketingAttributes('boardScreen', window.location.href);
 *
 * Analytics.sendScreenEvent({
 *   name: 'boardScreen',
 *   attributes: {
 *     ...marketingAttributes,
 *   },
 * });
 *
 */
export const getMarketingAttributes = (
  screenName: SourceType,
  url: URL,
  referrerAttributes: ReferrerAttributes | undefined,
): MarketingAttributes => {
  const pagePath = scrubMarketingUrl(url.pathname, screenName);
  const baseAttributes: BaseAttributes = {
    writeKey: 'trello',
    isMarketingEvent: true,
    page_path: pagePath,
    page_domain: url.origin,
    page_canonical_url: `${url.origin}${pagePath}`,
    page_url: `${url.origin}${pagePath}`,
  };

  const urlSearchParams = getSearchParamsMarketingAttributes(url);
  const urlSearchParamsString = new URLSearchParams(urlSearchParams).toString();
  if (urlSearchParamsString.length > 0) {
    baseAttributes.page_canonical_url += `?${urlSearchParamsString}`;
    baseAttributes.page_url += `?${urlSearchParamsString}`;
    baseAttributes.page_url_parameters = `?${urlSearchParamsString}`;
    baseAttributes.page_url_params_json = JSON.stringify(urlSearchParams);
  }

  return {
    ...baseAttributes,
    ...urlSearchParams,
    ...referrerAttributes,
  };
};
