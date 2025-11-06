import type { EventAttribute, EventAttributes } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import {
  asString,
  getLanguage,
  isBrowserSupported,
  isDesktop,
} from '@trello/browser';
import { bifrostTrack, clientVersion, desktopVersion } from '@trello/config';
import { getScreenFromUrl } from '@trello/marketing-screens';
import type { SafeUrl } from '@trello/safe-urls';

import { getMemberProperty } from './getMemberProperty';
import { getSessionId } from './getSessionId';
import type { OwnershipArea } from './ownershipAreas';

interface NetworkErrorEventInput {
  status: number;
  response: EventAttribute;
  url: SafeUrl | string;
  operationName?: string;
  ownershipArea?: OwnershipArea;
}

interface NetworkErrorEventAttributes
  extends Omit<NetworkErrorEventInput, 'url'>,
    EventAttributes {
  url: string;
  trelloSessionId: string;
  channel: string | null;
  clientVersion: string;
  isBrowserSupported: boolean;
  browser: string;
  isDesktop: boolean;
  desktopVersion: string;
  language: string;
  idMember?: string;
}

const redactTokensInUrl = (url: string) => {
  return url.replace(/([?&]\w*tokens?=).+?(&.*|$)/gi, '$1[REDACTED]$2');
};

/**
 * Sends a network error event to GAS
 */
export const sendNetworkErrorEvent = async ({
  status,
  response,
  url,
  operationName,
  ownershipArea,
}: NetworkErrorEventInput) => {
  const attributes: NetworkErrorEventAttributes = {
    // input
    status,
    response,
    url: redactTokensInUrl((url as unknown as string) ?? ''),
    operationName,
    ownershipArea,

    // derived attributes
    trelloSessionId: getSessionId(),
    channel: bifrostTrack,
    clientVersion,
    isBrowserSupported: isBrowserSupported(),
    browser: asString,
    isDesktop: isDesktop(),
    desktopVersion,
    language: getLanguage(),
    ...getMemberProperty(),
  };

  Analytics.sendOperationalEvent({
    action: 'failed',
    actionSubject: 'request',
    source: getScreenFromUrl(),
    attributes,
  });
};
