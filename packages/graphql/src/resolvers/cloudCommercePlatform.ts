import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch, safeTrelloFetch } from '../fetch';
import type { MutationCreateOrderArgs, QueryGetOrderArgs } from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

export const createTransactionAccount: TrelloRestResolver<void> = async (
  obj,
  args,
  context,
) => {
  const apiUrl = sanitizeUrl`/1/atl/ccp/createTransactionAccount`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-Trello-Client-Version': context.clientAwareness.version,
      'Content-Type': 'application/json',
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
  const body = await response.json();
  return body;
};

export const createOrder: TrelloRestResolver<MutationCreateOrderArgs> = async (
  obj,
  { idTransactionAccount, metadata, offering },
  context,
) => {
  const apiUrl = sanitizeUrl`/1/atl/ccp/orders`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-Trello-Client-Version': context.clientAwareness.version,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transactionAccountId: idTransactionAccount,
      metadata,
      offering,
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
  const body = await response.json();
  return body;
};

export const getOrderResolver: TrelloRestResolver<QueryGetOrderArgs> = async (
  _,
  { idOrder, idTransactionAccount },
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/atl/ccp/orders/${{
    value: idOrder,
    type: 'otherId',
  }}`;
  // poll orders endpoint until org has been created
  let body;
  while (!body?.organization) {
    const response = await safeTrelloFetch(apiUrl, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-Trello-Client-Version': context.clientAwareness.version,
        'X-transaction-account': idTransactionAccount,
        'Content-Type': 'application/json',
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
    body = await response.json();
  }
  return prepareDataForApolloCache(body, rootNode);
};
