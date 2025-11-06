import { Analytics } from '@trello/atlassian-analytics';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch } from '../fetch';
import type {
  MutationAddCustomFieldOptionArgs,
  MutationCreateCustomFieldArgs,
  MutationDeleteCustomFieldArgs,
  MutationDeleteCustomFieldOptionArgs,
  MutationUpdateCustomFieldArgs,
  MutationUpdateCustomFieldItemArgs,
  MutationUpdateCustomFieldOptionArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

export const createCustomField: TrelloRestResolver<
  MutationCreateCustomFieldArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { name, idModel, modelType, display, type, options } = args;

  const apiUrl = sanitizeUrl`/1/customFields`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      display_cardFront: display.cardFront,
      idModel,
      modelType,
      name,
      options,
      type,
      ...getCsrfRequestPayload(),
    }),
  });

  const customField = await response.json();

  return prepareDataForApolloCache(customField, rootNode);
};

export const deleteCustomField: TrelloRestResolver<
  MutationDeleteCustomFieldArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { idCustomField } = args;

  const apiUrl = sanitizeUrl`/1/customFields/${{
    value: idCustomField,
    type: 'otherId',
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

  const customField = await response.json();

  return prepareDataForApolloCache(customField, rootNode);
};

export const updateCustomField: TrelloRestResolver<
  MutationUpdateCustomFieldArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { name, idCustomField, display, pos } = args;

  const apiUrl = sanitizeUrl`/1/customFields/${{
    value: idCustomField,
    type: 'otherId',
  }}`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      'display/cardFront': display?.cardFront,
      name,
      pos,
      ...getCsrfRequestPayload(),
    }),
  });

  const customField = await response.json();

  return prepareDataForApolloCache(customField, rootNode);
};

export const deleteCustomFieldOption: TrelloRestResolver<
  MutationDeleteCustomFieldOptionArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { idCustomField, idCustomFieldOption } = args;

  const apiUrl = sanitizeUrl`/1/customFields/${{
    value: idCustomField,
    type: 'otherId',
  }}/options/${{ value: idCustomFieldOption, type: 'otherId' }}`;
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

  const customField = await response.json();

  return prepareDataForApolloCache(customField, rootNode);
};

export const addCustomFieldOption: TrelloRestResolver<
  MutationAddCustomFieldOptionArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { name, idCustomField } = args;

  const apiUrl = sanitizeUrl`/1/customFields/${{
    value: idCustomField,
    type: 'otherId',
  }}/options`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      value: { text: name },
      ...getCsrfRequestPayload(),
    }),
  });

  const customField = await response.json();

  return prepareDataForApolloCache(customField, rootNode);
};

export const updateCustomFieldOption: TrelloRestResolver<
  MutationUpdateCustomFieldOptionArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { idCustomField, idCustomFieldOption, name, color, pos } = args;

  const apiUrl = sanitizeUrl`/1/customFields/${{
    value: idCustomField,
    type: 'otherId',
  }}/options/${{ value: idCustomFieldOption, type: 'otherId' }}`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      color,
      value: name ? { text: name } : undefined,
      pos,
      ...getCsrfRequestPayload(),
    }),
  });

  const customField = await response.json();

  return prepareDataForApolloCache(customField, rootNode);
};

export const updateCustomFieldItem: TrelloRestResolver<
  MutationUpdateCustomFieldItemArgs
> = async (
  obj,
  { idCard, idCustomField, value, idValue, traceId },
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/card/${{
    value: idCard,
    type: 'cardId',
  }}/customField/${{ value: idCustomField, type: 'otherId' }}/item`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      idValue,
      value: value ?? '',
      ...getCsrfRequestPayload(),
      ...Analytics.getTaskRequestHeaders(traceId),
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

  const customFieldItem = await response.json();

  return prepareDataForApolloCache(customFieldItem, rootNode);
};
