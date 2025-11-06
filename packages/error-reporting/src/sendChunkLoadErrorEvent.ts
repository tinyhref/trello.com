import { Analytics } from '@trello/atlassian-analytics';
import { browserStr, isBrowserSupported } from '@trello/browser';
import { bifrostTrack, desktopVersion } from '@trello/config';
import { getScreenFromUrl } from '@trello/marketing-screens';

import { getSessionId } from './getSessionId';
import { redactUrlsInStackTrace } from './redactUrlsInStackTrace';

export const sendChunkLoadErrorEvent = async (error: Error) => {
  const source = getScreenFromUrl();

  Analytics.sendOperationalEvent({
    source,
    action: 'errored',
    actionSubject: 'chunkLoad',
    attributes: {
      trelloSessionId: getSessionId(),
      channel: bifrostTrack,
      isBrowserSupported: isBrowserSupported(),
      browser: browserStr,
      desktopVersion,
      stack: error.stack ? redactUrlsInStackTrace(error.stack) : undefined,
      name: 'HandledChunkLoadError',
    },
  });
};
