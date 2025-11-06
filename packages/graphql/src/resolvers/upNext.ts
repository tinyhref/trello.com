import { Analytics } from '@trello/atlassian-analytics';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeTrelloFetch } from '../fetch';
import type {
  MutationDismissUpNextCardArgs,
  QueryUpNextArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import { type TrelloRestResolver } from '../types';

export const upNextResolver: TrelloRestResolver<QueryUpNextArgs> = async (
  obj,
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { memberId, traceId } = args;

  const params = new URLSearchParams();
  params.set('board_memberships', 'all');
  params.set('board_memberships_orgMemberType', 'true');
  params.set('action_reactions', 'true');
  params.set('board_customFields', 'true');
  params.set('card_customFieldItems', 'true');

  const apiUrl = sanitizeUrl`/1/members/${{
    value: memberId,
    type: 'memberId',
  }}/upNext?${params}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'upNext',
      operationName: context.operationName,
      traceId: traceId ? traceId : undefined,
    },
  });

  if (response.ok) {
    const model = await response.json();
    return prepareDataForApolloCache(model, rootNode);
  } else {
    throw new Error(
      `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
    );
  }
};

export const dismissUpNextCard: TrelloRestResolver<
  MutationDismissUpNextCardArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/members/${{
    value: args.memberId,
    type: 'memberId',
  }}/upNext/${{ value: args.id, type: 'upNextId' }}`;

  const response = await safeTrelloFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      dismissed: args.dismissed,
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

  return prepareDataForApolloCache({ success: true }, rootNode);
};
