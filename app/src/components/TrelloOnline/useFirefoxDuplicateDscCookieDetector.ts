import { useEffect } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { isFirefox } from '@trello/browser';
import { Cookies } from '@trello/cookies';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { detectDuplicateCookies } from '@trello/session-cookie';

export const HAS_UNSET_DUPLICATE_DSC_COOKIE_KEY = 'has-unset-duplicate-dsc';

async function unsetDuplicateDscCookie() {
  if (!isFirefox() || Cookies.get(HAS_UNSET_DUPLICATE_DSC_COOKIE_KEY)) {
    return;
  }
  const numDscBefore = detectDuplicateCookies('dsc');
  if (numDscBefore > 1) {
    // Unset all DSC cookies:
    Cookies.remove('dsc', { partitioned: true, secure: true });
    Cookies.remove('dsc');

    // Set a session cookie to prevent us from reloading multiple times:
    await Cookies.set(
      HAS_UNSET_DUPLICATE_DSC_COOKIE_KEY,
      'true',
      {},
      'necessary',
    );

    // This event name isn't super accurate in the event that the feature gate
    // is disabled, but naming is hard.
    Analytics.sendOperationalEvent({
      action: 'unset',
      actionSubject: 'cookie',
      actionSubjectId: 'duplicateDscCookie',
      source: getScreenFromUrl(),
      attributes: {
        numDscBefore,
        numDscAfter: detectDuplicateCookies('dsc'),
      },
    });

    window.location.reload();
  }
}

/**
 * Firefox 131 introduced a bug with partioned cookies that can result in
 * duplicate DSCs. In this scenario, we need to unset the partitioned DSC cookie
 * and refresh, which should resolve the issue.
 *
 * Bug reports:
 * - https://ops.internal.atlassian.com/jira/browse/HOT-112328
 * - https://bugzilla.mozilla.org/show_bug.cgi?id=1922193
 */
export function useFirefoxDuplicateDscCookieDetector() {
  useEffect(() => {
    unsetDuplicateDscCookie();
  }, []);
}
