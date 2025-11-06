import { sanitizeUrl } from '@trello/safe-urls';

import { safeTrelloFetch } from '../fetch';
import type { QueryEmailProviderArgs } from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

export const emailProviderResolver: TrelloRestResolver<
  QueryEmailProviderArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const email = args?.email;

  const params = new URLSearchParams();
  params.set('email', email);

  const apiUrl = sanitizeUrl`/checkYourEmail?${params}`;

  const response = await safeTrelloFetch(
    apiUrl,
    { credentials: 'same-origin' },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'EmailProvider',
        operationName: context.operationName,
      },
    },
  );

  const emailProvider = await response.json();

  if (emailProvider.error) {
    throw new Error(emailProvider.error);
  }

  return prepareDataForApolloCache(emailProvider, rootNode);
};
