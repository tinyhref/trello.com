import { useEffect, useState } from 'react';

import { shouldRenderBanner } from '@atlassian/browser-storage-controls';

export function useCookiesConsentBanner() {
  const [cookiesBannerState, setCookiesBannerState] = useState(false);
  async function checkCookies() {
    try {
      const hasCookie = await shouldRenderBanner();
      setCookiesBannerState(hasCookie);
    } catch (e) {
      console.error(e);
    }
  }
  useEffect(() => {
    checkCookies();
  }, []);

  const wouldRender = cookiesBannerState;
  return {
    wouldRender,
    checkCookies,
  };
}
