import { sanitizeUrl } from '@trello/safe-urls';

import { safeTrelloFetch } from '../fetch';
import type { QueryHighlightsArgs } from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import { type TrelloRestResolver } from '../types';

export const highlightsResolver: TrelloRestResolver<
  QueryHighlightsArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { memberId, organizationId, since, before, traceId } = args;

  const params = new URLSearchParams();
  params.set('board_memberships', 'all');
  params.set('board_memberships_orgMemberType', 'true');
  params.set('action_reactions', 'true');
  params.set('board_customFields', 'true');
  params.set('card_customFieldItems', 'true');

  if (since) {
    params.set('since', since);
  }
  if (before) {
    params.set('before', before);
  }
  if (organizationId) {
    params.set('organization', organizationId);
  }

  const apiUrl = sanitizeUrl`/1/members/${{
    value: memberId,
    type: 'memberId',
  }}/highlights?${params}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'highlights',
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
