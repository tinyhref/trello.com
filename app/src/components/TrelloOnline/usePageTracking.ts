import { useEffect } from 'react';

import { Analytics } from '@trello/atlassian-analytics';

import { getMarketingScreenInfo } from 'app/src/getMarketingScreenInfo';

const onPushOrPop = function () {
  const { url, screenName, referrerUrl, referrerScreenName } =
    getMarketingScreenInfo();
  Analytics.sendPageviewEvent({
    url,
    screen: screenName,
    referrerUrl,
    referrerScreen: referrerScreenName,
  });
};

// This hook relies on @trello/history-events to polyfill the pushstate event.
export const usePageTracking = () => {
  useEffect(() => {
    const { url, screenName, referrerUrl, referrerScreenName } =
      getMarketingScreenInfo();
    Analytics.sendPageviewEvent({
      url,
      screen: screenName,
      referrerUrl,
      referrerScreen: referrerScreenName,
    });

    window.addEventListener('pushstate', onPushOrPop);
    window.addEventListener('popstate', onPushOrPop);

    return () => {
      window.removeEventListener('pushstate', onPushOrPop);
      window.removeEventListener('popstate', onPushOrPop);
    };
  }, []);
};
