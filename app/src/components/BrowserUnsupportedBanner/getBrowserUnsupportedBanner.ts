import {
  isAndroid,
  isBrowserSupported,
  isDesktop,
  isIos,
} from '@trello/browser';
import { TrelloStorage } from '@trello/storage';

const LAST_DISMISSED_STORAGE_KEY = 'unsupportedBrowserBannerLastDismissed';

// We don't want to tell mobile device users to upgrade their browser because they often can't on older devices.
// Also, there is an issue where some users are potentially seeing this banner when they shouldn't, so we'd like
// to collect data on their user agent.
const isMobile = () => isIos() || isAndroid();
const shouldShowBrowserUnsupportedBanner = () => {
  return !isBrowserSupported() && !isDesktop() && !isMobile();
};

export function getBrowserUnsupportedBanner() {
  const lastDismissed = TrelloStorage.get(LAST_DISMISSED_STORAGE_KEY);

  const week = 7 * 24 * 60 * 60 * 1000;
  const isHidden = lastDismissed
    ? new Date().valueOf() - new Date(lastDismissed).valueOf() < week
    : false;

  return {
    wouldRender: shouldShowBrowserUnsupportedBanner() && !isHidden,
  };
}
