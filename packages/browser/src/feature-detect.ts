import memoizeOne from 'memoize-one';

import { Cookies } from '@trello/cookies';
import type { TrelloWindow } from '@trello/window-types';

import {
  isChrome,
  isDesktop,
  isEdge,
  isFirefox,
  isSafari,
} from './browser-detect';

declare const window: TrelloWindow;

// Cookies.get is surprisingly expensive when used over a large number of functions, so
// we memoize it using document.cookie
const isForceAtlassianEmbeddedDocument = memoizeOne(
  (cookies: string): boolean => {
    return Cookies.get('force_atlassian_embeddedDocument') === 'true';
  },
);

const isForceEmbeddedDocument = memoizeOne((cookies: string): boolean => {
  return (
    Cookies.get('force_embeddedDocument') === 'true' ||
    isForceAtlassianEmbeddedDocument(cookies)
  );
});

export function isEmbeddedDocument(): boolean {
  return isForceEmbeddedDocument(document.cookie) || window.top !== window.self;
}

export const isTabActive = (): boolean =>
  document.visibilityState === 'visible';

export const isHighDPI = (): boolean => window.devicePixelRatio > 1;

// Safari 14 still not able to dynamically change favicon
export const supportsDynamicFavicon = (): boolean =>
  isChrome() || isFirefox() || isEdge();

export const supportsFancyPeel = (): boolean =>
  isChrome() || isFirefox() || isSafari();

export const isEmbeddedInMSTeams = (): boolean => {
  if (!isEmbeddedDocument()) {
    return false;
  }

  const search = new URLSearchParams(window.location.search);
  return search.has('iframeSource') && search.get('iframeSource') === 'msteams';
};

export const isEmbeddedInAtlassian = (): boolean => {
  if (isForceAtlassianEmbeddedDocument(document.cookie)) {
    return true;
  }

  if (!isEmbeddedDocument()) {
    return false;
  }

  const search = new URLSearchParams(window.location.search);
  return (
    search.has('iframeSource') &&
    search.get('iframeSource') === 'atlassian-smart-link'
  );
};

export const dontUpsell = (): boolean =>
  isDesktop() || isEmbeddedInMSTeams() || isEmbeddedInAtlassian();
