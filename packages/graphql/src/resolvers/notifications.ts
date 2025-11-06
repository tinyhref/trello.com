import type { FieldNode } from 'graphql';

import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeTrelloFetch } from '../fetch';
import type {
  MutationSetNotificationsReadArgs,
  QueryNotificationGroupsArgs,
  QueryNotificationsArgs,
  QueryNotificationsCountArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import {
  getChildFieldNames,
  getChildNodes,
} from '../restResourceResolver/queryParsing';
import type { TrelloRestResolver } from '../types';

export const notificationsCountResolver: TrelloRestResolver<
  QueryNotificationsCountArgs | null
> = async (_parent, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { grouped, filter } = args || {};
  const params = new URLSearchParams();

  if (grouped) {
    params.set('grouped', grouped.toString());
  }

  if (filter) {
    params.set('filter', filter);
  }

  const apiUrl =
    params.toString().length > 0
      ? sanitizeUrl`/1/members/me/notificationsCount?${params}`
      : sanitizeUrl`/1/members/me/notificationsCount`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'notificationsCount',
        operationName: context.operationName,
      },
    },
  );

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const notificationsCount = await response.json();

  return prepareDataForApolloCache(notificationsCount, rootNode);
};

export const notificationsResolver: TrelloRestResolver<
  QueryNotificationsArgs | null
> = async (_parent, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const params = new URLSearchParams();

  if (args?.limit !== undefined) {
    params.set('limit', `${args.limit}`);
  }

  if (args?.page !== undefined) {
    params.set('page', `${args.page}`);
  }

  if (args?.readFilter !== undefined) {
    params.set('read_filter', `${args.readFilter}`);
  }

  const children = getChildNodes(rootNode);

  const displaySection = children.find(
    (child) => child.name.value === 'display',
  );

  if (displaySection) {
    params.set('display', 'true');
  }

  const apiUrl = sanitizeUrl`/1/members/me/notifications?${params}`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'notifications',
        operationName: context.operationName,
      },
    },
  );

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const notifications = await response.json();

  return prepareDataForApolloCache(notifications, rootNode);
};

export const notificationGroupsResolver: TrelloRestResolver<
  QueryNotificationGroupsArgs | null
> = async (_parent, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const params = new URLSearchParams();
  if (args?.limit !== undefined) {
    params.set('limit', `${args.limit}`);
  }

  if (args?.skip !== undefined) {
    params.set('skip', `${args.skip}`);
  }

  if (args?.idCards !== undefined && Array.isArray(args?.idCards)) {
    params.set('idCards', args.idCards.join(','));
  }

  if (args?.read_filter) {
    params.set('read_filter', args.read_filter);
  }

  const children = getChildNodes(rootNode);

  const cardSelection = children.find((child) => child.name.value === 'card');

  // We check idCards here to preserve the behavior of the way we used to load notifications. We should ideally remove this
  // condition and allow optimization of card_fields even when idCards is set.
  if (cardSelection) {
    // Converts sub-selections on "card" to REST args.
    params.set('card_fields', getChildFieldNames(cardSelection).join(','));

    const boardSelection = cardSelection.selectionSet?.selections.find(
      (child) => {
        if (child.kind === 'Field') {
          return child.name.value === 'board';
        }
      },
    ) as FieldNode;

    if (boardSelection) {
      // Converts sub-selections on "board" to REST args.
      params.set(
        'card_board_fields',
        getChildFieldNames(boardSelection).join(','),
      );
    }
  }

  let apiUrl = null;
  if (args?.idCards === undefined) {
    if (params.toString().length > 0) {
      apiUrl = sanitizeUrl`/1/members/me/notificationGroups?${params}`;
    } else {
      apiUrl = sanitizeUrl`/1/members/me/notificationGroups`;
    }
  } else {
    if (params.toString().length > 0) {
      apiUrl = sanitizeUrl`/1/notificationGroups?${params}`;
    } else {
      apiUrl = sanitizeUrl`/1/notificationGroups`;
    }
  }
  const response = await safeTrelloFetch(
    apiUrl,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'notificationGroups',
        operationName: context.operationName,
      },
    },
  );

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const notificationGroups = await response.json();

  return prepareDataForApolloCache(notificationGroups, rootNode);
};

export const setNotificationsRead: TrelloRestResolver<
  MutationSetNotificationsReadArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/notifications/all/read`;
  const response = await safeTrelloFetch(
    apiUrl,
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        read: args.read,
        ids: args.ids.join(','),
        ...getCsrfRequestPayload(),
      }),
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'trelloFetch',
        operationName: 'setNotificationsRead',
      },
    },
  );

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  await response.json();

  return prepareDataForApolloCache({ success: true }, rootNode);
};
export const setAllNotificationsRead: TrelloRestResolver<object> = async (
  obj,
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/notifications/all/read`;
  const response = await safeTrelloFetch(
    apiUrl,
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        ...getCsrfRequestPayload(),
      }),
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'trelloFetch',
        operationName: 'setAllNotificationsRead',
      },
    },
  );

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  await response.json();

  return prepareDataForApolloCache({ success: true }, rootNode);
};
