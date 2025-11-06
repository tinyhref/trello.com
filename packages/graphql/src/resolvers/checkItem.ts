import { Analytics } from '@trello/atlassian-analytics';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch } from '../fetch';
import type {
  MutationAddCheckItemArgs,
  MutationConvertCheckItemToCardArgs,
  MutationDeleteCheckItemArgs,
  MutationUpdateCheckItemArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

export const addCheckItem: TrelloRestResolver<
  MutationAddCheckItemArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  if (!args.checklistId) {
    throw new Error('Expected checklistId is missing.');
  }
  const apiUrl = sanitizeUrl`/1/cards/${{
    value: args.cardId,
    type: 'cardId',
  }}/checklist/${{ value: args.checklistId, type: 'otherId' }}/checkItem`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      name: args.name,
      due: args.due,
      dueReminder: args.dueReminder,
      idMember: args.idMember,
      nameData: {
        emoji: {},
      },
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const checkItem = await response.json();

  return prepareDataForApolloCache(checkItem, rootNode);
};

export const deleteCheckItem: TrelloRestResolver<
  MutationDeleteCheckItemArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards/${{
    value: args.cardId,
    type: 'cardId',
  }}/checklist/${{ value: args.checklistId, type: 'otherId' }}/checkItem/${{
    value: args.checkItemId,
    type: 'otherId',
  }}`;
  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

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

export const updateCheckItem: TrelloRestResolver<
  MutationUpdateCheckItemArgs
> = async (obj, { cardId, checkItemId, traceId, checkItem }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards/${{
    value: cardId,
    type: 'cardId',
  }}/checkItem/${{ value: checkItemId, type: 'otherId' }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      ...checkItem,
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

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

export const convertCheckItemToCard: TrelloRestResolver<
  MutationConvertCheckItemToCardArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const params = new URLSearchParams(
    getCsrfRequestPayload({ fallbackValue: '' }),
  );

  const apiUrl = sanitizeUrl`/1/cards/${{
    value: args.cardId,
    type: 'cardId',
  }}/checklist/${{ value: args.checklistId, type: 'otherId' }}/checkItem/${{
    value: args.checkItemId,
    type: 'otherId',
  }}/convertToCard`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: params,
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

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
