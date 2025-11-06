import { Analytics } from '@trello/atlassian-analytics';
import {
  browserStr,
  browserVersionStr,
  isBrowserSupported,
  isDesktop,
} from '@trello/browser';
import { bifrostTrack, clientVersion, desktopVersion } from '@trello/config';
import { detectDuplicateCookies } from '@trello/session-cookie';

import { getSessionId } from './getSessionId';

export const startSession = async () => {
  const source = 'appStartup';
  const attributes = {
    channel: bifrostTrack,
    clientVersion,
    trelloSessionId: getSessionId(),
    isBrowserSupported: isBrowserSupported(),
    browser: browserStr,
    browserVersion: browserVersionStr,
    isDesktop: isDesktop(),
    desktopVersion,
    numDsc: detectDuplicateCookies('dsc'),
    numTokens: detectDuplicateCookies(`token${window.location.port}`),
    hasIdMemberCookie: document.cookie.indexOf('idMember=') !== -1,
  };

  Analytics.sendOperationalEvent({
    source,
    action: 'started',
    actionSubject: 'session',
    attributes,
  });
};
