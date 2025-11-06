import type { DocumentNode, FieldNode } from 'graphql';

import {
  getErrorTextFromFetchResponse,
  isFetchCancellationError,
} from '@trello/error-handling';
import { trelloFetch } from '@trello/fetch';
import type { RestResourceResolverArgs } from '@trello/graphql';
import {
  client,
  getOperationDefinitionNode,
  getRootNodeForQuery,
  queryToApiUrl,
} from '@trello/graphql';

import type { MappingRules } from 'app/scripts/db/db.types';
import { ninvoke } from 'app/scripts/lib/util/ninvoke';
import type { ModelTypes } from './loadApiDataFromUrl';
import { ModelCache } from './ModelCache';

export const loadApiDataFromGraphQL = async <
  TQuery,
  TVariables extends RestResourceResolverArgs,
>(
  modelType: ModelTypes,
  {
    query,
    variables,
    mappingRules,
    canReadFromCache = false,
  }: {
    query: DocumentNode;
    variables: TVariables;
    mappingRules?: MappingRules;
    canReadFromCache?: boolean;
  },
): Promise<TQuery> => {
  const operationNode = getOperationDefinitionNode(query);
  const rootNode = getRootNodeForQuery(operationNode!);

  let data = null;
  let error = null;

  if (canReadFromCache) {
    const response = await client.query<TQuery, TVariables>({
      query,
      variables,
      context: {
        document: query,
        operationName: operationNode?.name?.value,
      },
    });

    data = response.data;
    error = response.error;
    // @ts-expect-error data here is an object with the rootNode as first key
    data = data !== null ? JSON.parse(JSON.stringify(data[rootNode])) : null;
  } else {
    try {
      const rootFieldNode = operationNode?.selectionSet
        .selections[0] as FieldNode;
      const response = await trelloFetch(
        // @ts-expect-error this error doesn't really make much sense, since variables.id is a
        // string here, but it's saying it's string | null.
        queryToApiUrl(rootFieldNode, variables, variables.id),
        {},
        {
          networkRequestEventAttributes: {
            operationName: operationNode?.name?.value,
            source: 'model-loader',
          },
        },
      );

      if (response.ok) {
        data = await response.json();
      } else {
        error = getErrorTextFromFetchResponse(response);
      }
    } catch (err) {
      if (err instanceof Error && isFetchCancellationError(err)) {
        error = new Error('Fetch cancelled');
      } else {
        error = err;
      }
    }
  }

  if (error) {
    throw error;
  }

  const model = await ninvoke(
    ModelCache,
    'enqueueDelta',
    modelType,
    data,
    mappingRules,
    // skip syncing if we use network-only, since that will sync to cache for us
    {
      document: query,
      // if we used Apollo, the data is already in the Apollo cache
      skipSyncingToApollo: canReadFromCache,
    },
  );

  // @ts-expect-error
  return model;
};
