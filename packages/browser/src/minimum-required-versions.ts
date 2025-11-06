// This reflects the minimum browser version for a given family that was
// used by at least 0.5% of active users in the last 7 days.
// Latest suggested minima can be found by running
// https://splunk.paas-inf.net/en-US/app/search/trello_web_browser_versions?form.minPerc=1&form.field1.earliest=-7d%40h&form.field1.latest=now

export const MINIMUM_REQUIRED_VERSION: { [key in SupportedBrowser]: number } = {
  // https://trello.com/platforms says we support the latest version of
  // these four browsers
  chrome: 125,
  // We really want to set this to Firefox 121, for default `:has()` support,
  // but Firefox maintains an Extended Support Release (ESR) channel:
  // https://support.mozilla.org/en-US/kb/choosing-firefox-update-channel
  // ESR 115.8.0 was released on February 20, 2024; let's try again in 42 weeks.
  firefox: 115,
  edg: 125, // edg is the new Edge, 'edge' is legacy Edge
  // Minimum required version 17.4 for pdfjs-dist non-legacy API
  safari: 17.4, // Safari 17.4 was released on March 26, 2024

  // We don't officially support Opera, but it's being used by about 1% of users
  opera: 109,

  // Vivaldi accounts for less than 0.5% of traffic,
  // but we can leave it in until it causes a problem
  vivaldi: 3,
};

export type SupportedBrowser =
  | 'chrome'
  | 'edg'
  | 'firefox'
  | 'opera'
  | 'safari'
  | 'vivaldi';
