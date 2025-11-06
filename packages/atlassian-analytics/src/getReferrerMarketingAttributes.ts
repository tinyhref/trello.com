import type { SourceType } from '@trello/analytics-types';

import { getSearchParamsMarketingAttributes } from './getSearchParamsMarketingAttributes';
import { scrubMarketingUrl } from './scrubMarketingAnalyticsUrl';

// atlassian domains within this list are sanitized for use in tracking
const atlassianReferrerDomains = [
  'atlassian-organisation',
  'opsgenie.com',
  'bitbucket.org',
  'atlassian.net',
  'trello.com',
  'trellis.coffee',
  'localhost',
];

const isInternal = (referrerDomain: string): boolean => {
  // treat blog.trello.com and help.trello.com as external
  // domains because we don't need to sanitize
  if (
    referrerDomain === 'blog.trello.com' ||
    referrerDomain === 'help.trello.com'
  ) {
    return false;
  }

  return atlassianReferrerDomains.some((atlassianDomain): boolean => {
    return referrerDomain.includes(atlassianDomain);
  });
};

// uses the screen name for a referrer trello url so we can filter trello pathnames
// and sanitize the resulting value
const getInternalReferrerPathName = (
  referrer: URL,
  screenName: SourceType,
): string | undefined => {
  // this allows us to check URL scrubbing in non-prod environments
  const trelloDevEnvironment =
    referrer.host === 'trellis.coffee' ||
    referrer.host === 'localhost:2999' ||
    referrer.host === 'localhost:3000';

  if (
    referrer.pathname !== '/' &&
    (referrer.host === 'trello.com' || trelloDevEnvironment)
  ) {
    if (screenName === 'pageNotFoundErrorScreen') {
      return `/${screenName}`;
    }
    return scrubMarketingUrl(referrer.pathname, screenName);
  }
  return undefined;
};

const getPageReferrerUrl = (
  isInternalUrl: boolean,
  url: URL,
  screenName: SourceType,
): string | undefined => {
  const urlScrubbingDomains = [
    'trello.com',
    // this allows us to check URL scrubbing in non-prod environments
    'trellis.coffee',
    'localhost:2999',
    'localhost:3000',
  ];

  if (isInternalUrl) {
    if (urlScrubbingDomains.includes(url.host)) {
      return url.origin + getInternalReferrerPathName(url, screenName);
    }
    return url.origin;
  }

  return url.origin + url.pathname;
};

const getPageReferrerPath = (
  isInternalUrl: boolean,
  url: URL,
  screenName: SourceType,
): string | undefined => {
  return isInternalUrl
    ? getInternalReferrerPathName(url, screenName)
    : url.pathname;
};

export interface ReferrerAttributes {
  page_referrer_url?: string;
  page_referrer_path?: string | undefined;
  page_referrer_domain?: string;
  page_referrer_subdomain?: string;
  page_referrer_url_params_json?: string;
}

export const getReferrerMarketingAttributes = (
  referrer: URL,
  screenName: SourceType,
): ReferrerAttributes | undefined => {
  const isInternalReferral = isInternal(referrer.hostname);
  const attributes: ReferrerAttributes = {
    page_referrer_url: getPageReferrerUrl(
      isInternalReferral,
      referrer,
      screenName,
    ),
    page_referrer_domain: referrer.origin,
    page_referrer_subdomain: referrer.origin, // same as domain, will be transformed in MarketingEng pipeline
    page_referrer_path: getPageReferrerPath(
      isInternalReferral,
      referrer,
      screenName,
    ),
  };

  // Get relevant marketing attributes from the referrer url

  if (referrer.searchParams.toString().length > 0) {
    const referrerSearchParams = getSearchParamsMarketingAttributes(referrer);
    attributes.page_referrer_url_params_json =
      JSON.stringify(referrerSearchParams);
    const referrerSearchParamsString = new URLSearchParams(
      referrerSearchParams,
    ).toString();

    // The condition below is used to create the correct
    // `page_referrer_url` sanitized url format for opsgenie domains

    if (referrer.host.includes('opsgenie.com')) {
      attributes.page_referrer_url = referrer.origin;
    } else {
      attributes.page_referrer_url = attributes.page_referrer_url
        ? `${attributes.page_referrer_url}?${referrerSearchParamsString}`
        : undefined;
    }
  }
  return attributes;
};
