import type { GraphQLPayload, Preload } from './quickload.types';

/**
 * Builds the string key that can uniquely identify preload in the hash
 * @param url url of the preload
 * @param graphQLPayload graphQLPayload of the preload if exists
 * @returns unique key for preload that should be used in `preloadsHash`
 */
export const getPreloadHashKey = <
  T extends Pick<GraphQLPayload, 'operationName' | 'variables'>,
>({
  url,
  graphQLPayload,
}: {
  url: string;
  graphQLPayload?: T;
}) => {
  if (graphQLPayload) {
    const { operationName, variables } = graphQLPayload;
    return `${operationName}:${JSON.stringify(variables)}`;
  } else {
    return url;
  }
};

/**
 * Simple object that serves at the cache for preloads.
 * It maps a preload by unique key to an object that defines
 * the preloads status, callbacks, and more.
 */
export const preloadsHash: Record<string, Preload> = {};
