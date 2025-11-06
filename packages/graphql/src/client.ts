import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient } from '@apollo/client';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import type { DocumentNode } from 'graphql';

import { clientVersion } from '@trello/config';
import { getInvitationTokens } from '@trello/invitation-tokens/getInvitationTokens';

import { cache } from './cache';
import { resolvers } from './resolvers';
import typeDefs from './schema';
import { trelloLinkChain } from './trelloLinkChain';

if (process.env.NODE_ENV !== 'production') {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link: trelloLinkChain,
  name: 'trello-web',
  version: clientVersion,
  resolvers,
  typeDefs: typeDefs as DocumentNode,
  defaultOptions: {
    query: {
      context: {
        invitationTokens: getInvitationTokens(),
      },
    },
  },
  ...(process.env.NODE_ENV === 'development' && { connectToDevTools: true }),
});
