import { client } from '@trello/graphql';

import { cacheFactory } from './cacheFactory';
import { getQueryByOperationName } from './getQueryByOperationName';
import { getPreloadHashKey, preloadsHash } from './preloadsHash';
import type { GraphQLPayload } from './quickload.types';

/**
 * Runs the native GraphQL query defined in quickload by its name.
 * Skips if the query is already running in preload.
 *
 * @param operationName The name of the quickload operation
 * @param variables variables to pass into the query
 * @param shouldSkip function that returns 'true' if query should not run
 * @returns Apollo query result promise
 */
export const runGraphqlQuickloadQuery = ({
  operationName,
  variables,
  shouldSkip,
  returnErrors = false,
}: {
  operationName: string;
  variables: GraphQLPayload['variables'];
  shouldSkip: () => boolean;
  returnErrors?: boolean;
}) => {
  const preloadKey = getPreloadHashKey({
    url: '',
    graphQLPayload: {
      operationName,
      variables,
    },
  });
  const preloadObject = preloadsHash[preloadKey];
  const query = getQueryByOperationName(operationName);

  // Check that we are not waiting for the same query in preload
  if (query && preloadObject === undefined && !shouldSkip()) {
    const result = client.query({
      query,
      variables,
      context: {
        operationName: `quickload:${operationName}`,
      },
      errorPolicy: returnErrors ? 'all' : 'ignore',
    });
    cacheFactory.markQueryHydratedFor(operationName, 'ModelCache');
    cacheFactory.markQueryHydratedFor(operationName, 'Apollo');

    return result;
  }

  return Promise.resolve();
};
