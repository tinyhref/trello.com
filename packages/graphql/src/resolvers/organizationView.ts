import { Analytics } from '@trello/atlassian-analytics';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch } from '../fetch';
import type {
  MutationCreateOrganizationViewArgs,
  MutationDeleteOrganizationViewArgs,
  MutationUpdateOrganizationViewArgs,
  MutationUpdateViewInOrganizationViewArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

export const createOrganizationView: TrelloRestResolver<
  MutationCreateOrganizationViewArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { traceId, ...body } = args;
  const apiUrl = sanitizeUrl`/1/organizationViews`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      ...(body || {}),
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const updateOrganizationView: TrelloRestResolver<
  MutationUpdateOrganizationViewArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const body = {
    ...args.organizationView,
  };

  const apiUrl = sanitizeUrl`/1/organizationViews/${{
    value: args.idOrganizationView,
    type: 'organizationId',
  }}`;
  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      ...(body || {}),
      ...getCsrfRequestPayload(),
    }),
  });

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const updateViewInOrganizationView: TrelloRestResolver<
  MutationUpdateViewInOrganizationViewArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const body = {
    ...args.view,
  };

  const apiUrl = sanitizeUrl`/1/organizationViews/${{
    value: args.idOrganizationView,
    type: 'organizationId',
  }}/views/${{
    value: args.idView,
    type: 'otherId',
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      ...(body || {}),
      ...getCsrfRequestPayload(),
    }),
  });

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const deleteOrganizationView: TrelloRestResolver<
  MutationDeleteOrganizationViewArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/organizationViews/${{
    value: args.idOrganizationView,
    type: 'organizationId',
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
  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};
