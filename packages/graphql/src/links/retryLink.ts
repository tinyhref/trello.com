import type { Operation } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';

import { Analytics } from '@trello/atlassian-analytics';
import { getFeatureGateAsync } from '@trello/feature-gate-client';
import { internetConnectionState } from '@trello/internet-connection-state';

export function createRetryLink() {
  return new RetryLink({
    delay: {
      initial: 1000,
      max: 30000,
    },
    attempts: async (retryCount: number, operation: Operation, error) => {
      const isFailedToFetch = error.message.includes('Failed to fetch');

      const isRetryLinkEnabled = await getFeatureGateAsync(
        'trello_graphql_retry_link',
      );

      const queryNames = operation.query.definitions
        // Fallback to source name if name is not available
        .map((d) => ('name' in d ? d.name?.value : d.loc?.source.name))
        .filter((name) => name !== undefined)
        .join(',');

      Analytics.sendOperationalEvent({
        action: 'attempted',
        actionSubject: 'graphqlRetry',
        source: '@trello/graphql',
        attributes: {
          retryCount,
          error,
          queryNames,
          internetConnectionStatus: internetConnectionState.value,
        },
      });

      return isFailedToFetch && isRetryLinkEnabled;
    },
  });
}
