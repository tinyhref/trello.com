import { useCallback, useEffect, useRef } from 'react';

import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { googleTagManagerAuth, googleTagManagerPreview } from '@trello/config';
import { useDynamicConfig } from '@trello/dynamic-config';
import type { PIIString } from '@trello/privacy';
import { useSharedState } from '@trello/shared-state';
import type { TrelloWindow } from '@trello/window-types';

import { gtmSharedState } from './useGtmSharedState';

declare const window: TrelloWindow;

// Inline script for Google Tag Manager injection
const GTM_SCRIPT = `
    window.dataLayer=window.dataLayer||[];
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=${googleTagManagerAuth}&gtm_preview=${googleTagManagerPreview}&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-PJ8M5SK');
    window.GTMScriptLoadedCallback();
`;

export const useGoogleTagManager = () => {
  const [gtmState, setGtmState] = useSharedState(gtmSharedState);

  const isGoogleTagManagerEnabled = useDynamicConfig(
    'trello_web_google_tag_manager',
  );

  const { dismissOneTimeMessage } = useOneTimeMessagesDismissed();

  const scriptsInDocument = useRef(false);

  const loadGtmScript = useCallback(
    (gtmScript: HTMLScriptElement, emailDomain: PIIString | null) => {
      window.GTMScriptLoadedCallback = () => {
        // If a user is logged in, record their very first session
        if (emailDomain) {
          const gtm = window.dataLayer;
          if (gtm) {
            gtm.push({
              event: 'trello.possibleNewSignup',
              ed: emailDomain,
            });

            dismissOneTimeMessage('sent-possible-new-signup-event');
          }
        }
      };

      gtmScript.innerHTML = GTM_SCRIPT;
      document.head.append(gtmScript);
    },
    [dismissOneTimeMessage],
  );

  useEffect(() => {
    if (
      gtmState.userIsEligible &&
      isGoogleTagManagerEnabled &&
      gtmState.userHasConsented &&
      !scriptsInDocument.current
    ) {
      const gtmScript = document.createElement('script');
      loadGtmScript(gtmScript, gtmState.userEmailDomain);
      scriptsInDocument.current = true;
      setGtmState((previousValue) => ({
        ...previousValue,
        loadedInDocument: true,
      }));
    }
  }, [
    loadGtmScript,
    isGoogleTagManagerEnabled,
    gtmState.userIsEligible,
    gtmState.userHasConsented,
    gtmState.userEmailDomain,
    setGtmState,
  ]);
};
