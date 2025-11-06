import { AppId, appId } from '@trello/config';

import type { SupportedBrowser } from './minimum-required-versions';

// Older browsers support navigator.browserLanguage
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language
interface LegacyNavigator extends Navigator {
  browserLanguage?: string;
}

declare const navigator: Navigator & LegacyNavigator;

export type Browser =
  | SupportedBrowser
  | 'edge-legacy' // Legacy Edge 'edg/' is the new Edge
  | 'explorer'
  | 'samsung'
  | 'ucbrowser'
  | 'unknown-browser'
  | 'yandex';

type OS =
  | 'android'
  | 'ipad'
  | 'iphone'
  | 'ipod'
  | 'linux'
  | 'mac'
  | 'unknown-os'
  | 'windows';

// Yeah, yeah... UA sniffing is bad... come at me
export const getBrowserName = (
  { userAgent }: Navigator,
  document: Document,
): Browser => {
  // @ts-expect-error
  const ie = !!document.documentMode;
  const edge = userAgent.includes('Edg/');
  const edgeLegacy = userAgent.includes('Edge');
  const opera = userAgent.includes('Opera') || userAgent.includes('OPR');
  const vivaldi = userAgent.includes('Vivaldi');
  const firefox = userAgent.includes('Firefox');
  const uc = userAgent.includes('UCBrowser');
  const samsung = userAgent.includes('SamsungBrowser');
  const yandex = userAgent.includes('YaBrowser');
  const chrome =
    userAgent.includes('Chrom') &&
    !edge &&
    !edgeLegacy &&
    !opera &&
    !yandex &&
    !vivaldi &&
    !samsung &&
    !uc;
  const safari =
    userAgent.includes('CriOS') ||
    (userAgent.includes('Safari') &&
      !chrome &&
      !edge &&
      !edgeLegacy &&
      !opera &&
      !samsung &&
      !uc &&
      !vivaldi &&
      !yandex);

  switch (true) {
    case chrome:
      return 'chrome';
    case firefox:
      return 'firefox';
    case safari:
      return 'safari';
    case edge:
      return 'edg';
    case edgeLegacy:
      return 'edge-legacy';
    case ie:
      return 'explorer';
    case opera:
      return 'opera';
    case yandex:
      return 'yandex';
    case vivaldi:
      return 'vivaldi';
    case uc:
      return 'ucbrowser';
    case samsung:
      return 'samsung';
    default:
      return 'unknown-browser';
  }
};

export const UNKNOWN_BROWSER_VERSION = 'unknown-browser-version';
export type BrowserVersion = number | typeof UNKNOWN_BROWSER_VERSION;

const parseVersion = (
  prefix: string,
  { userAgent }: Navigator,
): BrowserVersion => {
  const start = userAgent.indexOf(prefix);
  if (start !== -1) {
    const fullVersion = userAgent.substring(start + prefix.length + 1);
    // Parse Major.minor version as float
    if (fullVersion.includes('.')) {
      // slice the major and minor version, join and parse as float
      return parseFloat(fullVersion.split('.').slice(0, 2).join('.'));
    } else {
      return parseInt(fullVersion, 10);
    }
  }

  return UNKNOWN_BROWSER_VERSION;
};

export const getSafariVersion = (nav: Navigator): BrowserVersion => {
  if (nav.userAgent.includes('CriOS')) {
    const match = nav.userAgent.match(
      /OS ([0-9]+)_[0-9]+(_[0-9]+)? like Mac OS X/,
    );
    return match ? +match[1] : UNKNOWN_BROWSER_VERSION;
  } else {
    return parseVersion('Version', nav);
  }
};

export const getBrowserVersion = (
  browser: Browser,
  nav: Navigator,
): number | 'unknown-browser-version' => {
  switch (browser) {
    case 'chrome': {
      const chromeDesktop = parseVersion('Chrome', nav);
      return chromeDesktop !== UNKNOWN_BROWSER_VERSION
        ? chromeDesktop
        : parseVersion('CriOS', nav);
    }
    case 'firefox':
      return parseVersion('Firefox', nav);
    case 'safari': {
      return getSafariVersion(nav);
    }
    case 'edg':
      return parseVersion('Edg', nav);
    case 'edge-legacy':
      return parseVersion('Edge', nav);
    case 'opera':
      return parseVersion('OPR', nav);
    case 'explorer': {
      const msie = parseVersion('MSIE', nav);
      return msie !== UNKNOWN_BROWSER_VERSION ? msie : parseVersion('rv', nav);
    }
    case 'yandex':
      return parseVersion('YaBrowser', nav);
    case 'vivaldi':
      return parseVersion('Vivaldi', nav);
    case 'samsung':
      return parseVersion('SamsungBrowser', nav);
    case 'ucbrowser':
      return parseVersion('UCBrowser', nav);
    default:
      return UNKNOWN_BROWSER_VERSION;
  }
};

export const getOS = ({ userAgent, platform }: Navigator): OS => {
  const win = platform.includes('Win');
  const mac = platform.includes('Mac');
  const linux = platform.includes('Linux');
  const android = userAgent.includes('Android');
  const ipad = userAgent.includes('iPad');
  const ipod = userAgent.includes('iPod');
  const iphone = userAgent.includes('iPhone');

  switch (true) {
    case win:
      return 'windows';
    case mac:
      return 'mac';
    case ipad:
      return 'ipad';
    case ipod:
      return 'ipod';
    case iphone:
      return 'iphone';
    case android:
      return 'android';
    case linux:
      return 'linux';
    default:
      return 'unknown-os';
  }
};

// Maintain existing API in classic by exporting these const string values

export const browserStr = getBrowserName(navigator, document); // "chrome"
export const browserVersion = getBrowserVersion(browserStr, navigator); // 72
export const browserVersionStr = `${browserStr}-${browserVersion}`; // "chrome-72"
export const osStr = getOS(navigator); // "mac"
export const asString = `${browserStr} ${browserVersionStr} ${osStr}`; // "chrome chrome-72 mac"

// Export helper APIs for convenience
export const isIE = () => browserStr === 'explorer';
export const isFirefox = () => browserStr === 'firefox';
export const isYandex = () => browserStr === 'yandex';
export const isVivaldi = () => browserStr === 'vivaldi';
export const isEdge = () => browserStr === 'edg';
export const isEdgeLegacy = () => browserStr === 'edge-legacy';
export const isSamsung = () => browserStr === 'samsung';
export const isUC = () => browserStr === 'ucbrowser';
export const isOpera = () => browserStr === 'opera';
export const isChrome = () => browserStr === 'chrome';
export const isSafari = () => browserStr === 'safari';
export const isWindows = () => osStr === 'windows';
export const isMac = () => osStr === 'mac';
export const isLinux = () => osStr === 'linux';
export const isAndroid = () => osStr === 'android';
export const isIPad = () => osStr === 'ipad';
export const isIPod = () => osStr === 'ipod';
export const isIPhone = () => osStr === 'iphone';
export const isIos = () => isIPad() || isIPhone() || isIPod();
export const isTouch = () => isIPad() || isIPhone() || isIPod() || isAndroid();
export const isDesktop = () => appId === AppId.Desktop;

export const getLanguage = () => {
  return navigator.language || navigator.browserLanguage || 'unknown';
};
