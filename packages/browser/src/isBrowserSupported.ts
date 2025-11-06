import type { Browser, BrowserVersion } from './browser-detect';
import {
  browserStr,
  browserVersion,
  UNKNOWN_BROWSER_VERSION,
} from './browser-detect';
import type { SupportedBrowser } from './minimum-required-versions';
import { MINIMUM_REQUIRED_VERSION } from './minimum-required-versions';

function isBrowserFamilySupported(name: Browser): name is SupportedBrowser {
  return Object.prototype.hasOwnProperty.call(MINIMUM_REQUIRED_VERSION, name);
}

export function isBrowserSupported(
  name: Browser = browserStr,
  version: BrowserVersion = browserVersion,
) {
  // If we couldn't compute the version, assume it's not supported
  if (version === UNKNOWN_BROWSER_VERSION) {
    return false;
  }

  if (!isBrowserFamilySupported(name)) {
    return false;
  }

  return version >= MINIMUM_REQUIRED_VERSION[name];
}
