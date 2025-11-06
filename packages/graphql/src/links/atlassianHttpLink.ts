import { from, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

import { getApiGatewayUrl } from '@trello/api-gateway';
import { developerConsoleState } from '@trello/developer-console-state';

import { cacheSubscriptionResponseLink } from './cacheSubscriptionResponseLink';
import { trelloRequiredHeadersLink } from './trelloRequiredHeadersLink';
import { wsLink } from './wsLink';

export const atlassianHttpLink = new HttpLink({
  credentials: 'include',
  uri: (operation) => {
    const operationNamesEnabled =
      developerConsoleState.value.operationNameInUrl;

    // We include the "operationName" parameter purely for debugging. This should never infer behavior or be relied
    // upon by the server.
    return !operationNamesEnabled || !operation.operationName
      ? getApiGatewayUrl('/graphql')
      : getApiGatewayUrl(`/graphql?operationName=${operation.operationName}`);
  },
});

export function createAtlassianHttpLink() {
  return split(
    // Condition for handling subscriptions
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    // WebSocket link for subscriptions
    from([cacheSubscriptionResponseLink, wsLink]),
    // HTTP link for non-subscription operations
    from([trelloRequiredHeadersLink, atlassianHttpLink]),
  );
}
