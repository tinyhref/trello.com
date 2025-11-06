import { getScreenFromUrl } from '@trello/marketing-screens';

export const getMarketingScreenInfo = () => {
  const url = new URL(window.location.href);
  const screenName = getScreenFromUrl();
  const referrerUrl = document.referrer
    ? new URL(document.referrer)
    : undefined;
  const referrerScreenName = getScreenFromUrl({
    pathname: referrerUrl?.pathname,
  });

  return {
    url,
    screenName,
    referrerUrl,
    referrerScreenName,
  };
};
