import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch, safeTrelloFetch } from '../fetch';
import type {
  MutationCreatePluginApplicationArgs,
  MutationUpdateApplicationArgs,
  QueryPluginApplicationArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

export const getPluginApplicationResolver: TrelloRestResolver<
  QueryPluginApplicationArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = args.forMember
    ? sanitizeUrl`/1/plugin/${{
        value: args.id,
        type: 'pluginId',
      }}/application/member`
    : sanitizeUrl`/1/plugin/${{
        value: args.id,
        type: 'pluginId',
      }}/application/`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'pluginApplication',
      operationName: context.operationName,
    },
  });

  const json = await response.json();

  if (response.ok) {
    return prepareDataForApolloCache(json, rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const createPluginApplication: TrelloRestResolver<
  MutationCreatePluginApplicationArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  if (!args.fields) {
    throw new Error('Expected fields argument is missing.');
  }
  if (!args.id) {
    throw new Error('Expected id argument is missing.');
  }

  const apiUrl = sanitizeUrl`/1/plugin/${{
    value: args.id,
    type: 'pluginId',
  }}/application`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...args.fields,
      ...getCsrfRequestPayload(),
    }),
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

  const application = await response.json();

  return prepareDataForApolloCache(application, rootNode);
};

export const updateApplication: TrelloRestResolver<
  MutationUpdateApplicationArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  if (!args.fields) {
    throw new Error('Expected fields argument is missing.');
  }

  const apiUrl = sanitizeUrl`/1/applications/${{
    value: args.applicationKey,
    type: 'applicationId',
  }}`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...args.fields,
      ...getCsrfRequestPayload(),
    }),
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

  const application = await response.json();

  return prepareDataForApolloCache(application, rootNode);
};
