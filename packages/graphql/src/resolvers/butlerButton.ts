import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch } from '../fetch';
import type {
  MutationAddButlerButtonArgs,
  MutationDeleteButlerButtonArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

export const addButlerButton: TrelloRestResolver<
  MutationAddButlerButtonArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/${{
    value: args.scope,
    type: 'stringUnion',
    allowedValues: ['boards', 'organizations'],
  }}/${{
    value: args.idScope,
    type: args.scope === 'boards' ? 'boardId' : 'workspaceId',
  }}/butlerButtons`;

  // Scope must be 'boards' | 'organizations'.
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...args.butlerButton,
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

  return prepareDataForApolloCache(await response.json(), rootNode);
};

export const deleteButlerButton: TrelloRestResolver<
  MutationDeleteButlerButtonArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/${{
    value: args.scope,
    type: 'stringUnion',
    allowedValues: ['boards', 'organizations'],
  }}/${{
    value: args.scope === 'boards' ? args.idBoard : args.idOrganization,
    type: args.scope === 'boards' ? 'boardId' : 'workspaceId',
  }}/butlerButton/${{
    value: args.idButton,
    type: 'butlerButtonId',
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
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

  return prepareDataForApolloCache(await response.json(), rootNode);
};
