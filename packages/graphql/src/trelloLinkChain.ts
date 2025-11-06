import { from } from '@apollo/client';

import { createAtlassianHttpLink } from './links/atlassianHttpLink';
import { handleUnauthorizedTokenLink } from './links/handleUnauthorizedTokenLink';
import { createRetryLink } from './links/retryLink';
import { serverGateOverridesLink } from './links/serverGateOverridesLink';

// We export this function mostly to help with testing.
export function createTrelloLinkChain() {
  return from([
    createRetryLink(),
    handleUnauthorizedTokenLink,
    serverGateOverridesLink(),
    createAtlassianHttpLink(),
  ]);
}

export const trelloLinkChain = createTrelloLinkChain();
