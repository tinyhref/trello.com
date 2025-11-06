import { sendNetworkErrorEvent } from '@trello/error-reporting';
// eslint-disable-next-line no-restricted-imports
import { fetch, trelloFetch } from '@trello/fetch';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { getNetworkClient } from '@trello/network-client';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import type {
  MutationDismissAnnouncementArgs,
  QueryAnnouncementsArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

export const announcementsResolver: TrelloRestResolver<
  QueryAnnouncementsArgs
> = async (_parent, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const networkClient = getNetworkClient();
  const apiUrl =
    args && args.filter === 'all'
      ? networkClient.getUrl('/announcements/all')
      : networkClient.getUrl('/announcements');
  const response = await trelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Announcements',
      operationName: context.operationName,
    },
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });

    throw await parseNetworkError(response);
  }

  const announcements = await response.json();

  return prepareDataForApolloCache(announcements, rootNode);
};

export const dismissAnnouncement: TrelloRestResolver<
  MutationDismissAnnouncementArgs
> = async (_obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const networkClient = getNetworkClient();
  const response = await fetch(networkClient.getUrl('/announcements/dismiss'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      id: args.announcementId,
      ...getCsrfRequestPayload(),
    }),
    credentials: 'include',
  });

  return prepareDataForApolloCache({ success: response.ok }, rootNode);
};
