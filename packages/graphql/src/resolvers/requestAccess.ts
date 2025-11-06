import { Analytics } from '@trello/atlassian-analytics';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch, safeTrelloFetch } from '../fetch';
import type {
  MutationDeleteAccessRequestArgs,
  QueryAccessRequestArgs,
  QueryAccessRequestVerificationArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

export const accessRequestResolver: TrelloRestResolver<
  QueryAccessRequestArgs | null
> = async (_parent, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { modelType, id } = args || {};
  const apiUrl = sanitizeUrl`/1/${{ value: modelType!, type: 'modelType' }}/${{
    value: id!,
    type: 'otherId',
  }}/requestAccess`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      credentials: 'same-origin',
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: `RequestAccess.${modelType}AccessRequest`,
        operationName: context.operationName,
      },
    },
  );

  const statusCode = response.status;

  const result = {
    allowed: true,
    reason: '',
  };
  if (!response.ok) {
    if ([400, 403, 409, 429].includes(statusCode)) {
      result.allowed = false;
      const text = await response.text();
      try {
        /* Response is JSON. */
        const res = JSON.parse(text);
        result.reason = res.message;
      } catch {
        /* Response is plain text. */
        result.reason = text;
      }
    } else {
      throw await parseNetworkError(response);
    }
  }

  return prepareDataForApolloCache(result, rootNode);
};

export const sendAccessRequest: TrelloRestResolver<
  QueryAccessRequestArgs | null
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { modelType, id, traceId } = args || {};
  const apiUrl = sanitizeUrl`/1/${{ value: modelType!, type: 'modelType' }}/${{
    value: id!,
    type: 'otherId',
  }}/requestAccess`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...getCsrfRequestPayload(),
      }),
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        operationType: 'mutation',
        resolver: `RequestAccess.${modelType}AccessRequest`,
        operationName: context.operationName,
      },
    },
  );

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

  const body = await response.json();

  return prepareDataForApolloCache(body, rootNode);
};

export const accessRequestVerificationResolver: TrelloRestResolver<
  QueryAccessRequestVerificationArgs | null
> = async (_parent, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { modelType, id, idInvitedMember, signature } = args || {};

  //Resolves VULN-1447267
  const memberIdFormat = /^[0-9a-zA-Z][^/\s]*$/gim;
  if (
    idInvitedMember &&
    idInvitedMember.length > 0 &&
    !memberIdFormat.test(idInvitedMember)
  ) {
    throw new Error(`Invalid member id: ${idInvitedMember}`);
  }

  //Resolves VULN-1447267
  const signatureFormat = /^[0-9a-fA-F]{32}$/gim;

  const apiUrl =
    signature && signatureFormat.test(signature)
      ? sanitizeUrl`/1/${{ value: modelType!, type: 'modelType' }}/${{
          value: id!,
          type: 'otherId',
        }}/accessRequests/${{
          value: encodeURIComponent(idInvitedMember!),
          type: 'memberId',
        }}/${{ value: encodeURIComponent(signature), type: 'signature' }}`
      : sanitizeUrl`/1/${{ value: modelType!, type: 'modelType' }}/${{
          value: id!,
          type: 'otherId',
        }}/accessRequests/${{
          value: encodeURIComponent(idInvitedMember!),
          type: 'memberId',
        }}`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      credentials: 'same-origin',
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: `RequestAccess.${modelType}AccessRequest`,
        operationName: context.operationName,
      },
    },
  );

  const result = {
    success: true,
  };
  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache(result, rootNode);
};

export const deleteAccessRequest: TrelloRestResolver<
  MutationDeleteAccessRequestArgs | null
> = async (_parent, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { modelType, id, idInvitedMember, signature, traceId } = args || {};
  const apiUrl = sanitizeUrl`/1/${{ value: modelType!, type: 'modelType' }}/${{
    value: id!,
    type: 'otherId',
  }}/accessRequests/${{ value: idInvitedMember!, type: 'memberId' }}/${{
    value: signature!,
    type: 'signature',
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  if (traceId) {
    const trelloServerVersion = response.headers.get('X-Trello-Version');
    Analytics.setTrelloServerVersion(traceId, trelloServerVersion);
  }

  const result = {
    success: true,
  };

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache(result, rootNode);
};
