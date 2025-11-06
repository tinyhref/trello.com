import { ApolloError } from '@apollo/client';

import { chunk } from '@trello/arrays';
import { dynamicConfigClient } from '@trello/dynamic-config';
import { isFetchCancellationError } from '@trello/error-handling';
import { sendErrorEvent, sendNetworkErrorEvent } from '@trello/error-reporting';
import {
  NetworkError,
  parseNetworkError,
} from '@trello/graphql-error-handling';
import { idCache, isShortLink } from '@trello/id-cache';

import {
  InvalidIDError,
  NoRootIdArgumentError,
  NoRootIdsArgumentError,
  NotFoundError,
} from '../errors';
import { safeTrelloFetch } from '../fetch';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import { firstLetterToUpper, singularize } from '../stringOperations';
import type {
  BatchRestResourceResolverArgs,
  JSONObject,
  RestResourceResolverArgs,
  TrelloRestResolver,
  TypedJSONObject,
} from '../types';
import { maybeLogCacheMisses } from './maybeLogCacheMisses';
import { queryToApiUrl, queryToBatchApiUrl } from './queryToApiUrl';

// This is the regex used to determine whether an id is a valid hex string
// that is 24 characters long
const OBJECT_ID_REGEX = new RegExp('^[0-9a-fA-F]{24}$');

const reportError = (
  err: Error | NetworkError | string,
  apiUrl: string,
  operationName: string,
) => {
  if (dynamicConfigClient.get('trello_web_error_handling_rrs')) {
    if (err instanceof NetworkError) {
      sendNetworkErrorEvent({
        status: err.status,
        // this might contain PII, so we are feature flagging
        response: err.message,
        url: apiUrl,
        operationName,
      });
    } else if (err instanceof Error) {
      if (isFetchCancellationError(err)) {
        // the user cancelled the operation, either by navigating away or by doing something else.
      } else {
        sendErrorEvent(err, {
          tags: {
            ownershipArea: 'trello-platform',
          },
          extraData: {
            component: 'restResourceResolver',
            operationName,
          },
        });
      }
    } else {
      sendErrorEvent(
        new Error(err || 'Unknown fetch error in restResourceResolver'),
        {
          tags: {
            ownershipArea: 'trello-platform',
          },
          extraData: {
            component: 'restResourceResolver',
            operationName,
          },
        },
      );
    }
  } else {
    console.error(err);
  }
};

/**
 * Attempt to satisfy all the requested data of a graphql query
 * by generating a REST API URL based on the nested resource
 * definitions in nestedResources.ts
 */
export const restResourceResolver: TrelloRestResolver<
  RestResourceResolverArgs
> = async (parent, rootArgs, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  // Currently we are only given access to the rootArgs (i.e the arguments passed to
  // the root node of the query). If we were using schema-link, this is where we could
  // pass the _full_ map of variables obtained via 'context'.
  let apiUrl = queryToApiUrl(rootNode, rootArgs, rootArgs.id);

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    await maybeLogCacheMisses(rootArgs, context, apiUrl);
  }

  // If an apiUrl could not be generated, it means no fields were being queried for
  // that can be resolved generically, so just forward the ID through for any custom
  // resolvers that might need it without needing a useless REST request needing to
  // be executed first.
  if (!apiUrl && rootArgs.id) {
    // To perform this optimisation we need to make sure the ID we were given is
    // _actually_ an ID, _not_ a name or some other identifier accepted by
    // server. This is so we can store this object in Apollo's cache by the same
    // ID that it would be stored under if it were fetched from server.
    if (!OBJECT_ID_REGEX.test(rootArgs.id)) {
      throw new InvalidIDError(rootArgs.id);
    }

    return prepareDataForApolloCache(
      {
        id: rootArgs.id,
      },
      rootNode,
    );
  }

  // If there was no apiUrl generated, but we didn't even have a rootId, something
  // went wrong
  if (!apiUrl) {
    throw new NoRootIdArgumentError(rootNode.name.value);
  }

  // add invitation tokens for annonymous users
  if (context.client.defaultOptions?.query?.context?.invitationTokens) {
    apiUrl += `&invitationTokens=${context.client.defaultOptions?.query?.context?.invitationTokens}`;
  }

  let model = null;

  // In a native GraphQL world, we'll pass the traceId via the context.
  // In client side resolvers, we pass it as a variable. We check if
  // it's defined here and pass it along to safeTrelloFetch to ultimately
  // set the tracing headers
  const traceId = rootArgs.traceId;

  try {
    const typename = singularize(firstLetterToUpper(rootNode.name.value));
    // @ts-expect-error - safeTrelloFetch expects a SafeUrl, but we pass in a string
    const response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: typename,
        operationName: context.operationName,
        traceId: typeof traceId === 'string' ? traceId : undefined,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if (response.status === 404) {
        model = null;
        if (context.returnNotFoundError) {
          throw new NotFoundError();
        }
      } else {
        throw await parseNetworkError(response);
      }
    }

    if (rootArgs?.id && isShortLink(rootArgs?.id) && model?.id) {
      if (typename === 'Board') {
        idCache.setBoardId(rootArgs.id, model.id);
      }
      if (typename === 'Card') {
        idCache.setCardId(rootArgs.id, model.id);
      }
    }

    return model ? prepareDataForApolloCache(model, rootNode) : model;
  } catch (err) {
    reportError(err as Error | string, apiUrl, context.operationName);

    /**
     * Previously, 404 Not Found errors would be ignored and return a null model.
     * If you want to handle the Not Found error in the component, you can use
     * context.returnNotFoundError = true, which will populate the error field,
     * allowing you to use it.
     */
    if (context.returnNotFoundError) {
      if (err instanceof NotFoundError) {
        throw new ApolloError({
          networkError: err,
          graphQLErrors: [],
          errorMessage: err.message,
        });
      }
    }

    /**
     * Previously, errors were ignored and we just returned the model. If you
     * want to handle errors in your component, you can use context.returnNetworkErrors true
     * and it will hit this point, which will populate the error field allowing you to use it.
     * Otherwise, you can not handle errors and rely on error reporting to splunk to diagnose
     * issues that come up in production.
     */
    if (context.returnNetworkErrors) {
      if (err instanceof NetworkError) {
        throw new ApolloError({
          networkError: err,
          graphQLErrors: [],
          errorMessage: err.message,
        });
      } else if (err instanceof Error) {
        throw new ApolloError({
          graphQLErrors: [],
          errorMessage: err.message,
          clientErrors: [err],
        });
      }
    }

    return model;
  }
};

export const MAX_BATCH_URLS = 10;
class BatchApiError {
  networkError: NetworkError;
  response: Response;

  constructor(error: NetworkError, response: Response) {
    this.networkError = error;
    this.response = response;
  }
}

export const batchRestResourceResolver: TrelloRestResolver<
  BatchRestResourceResolverArgs
> = async (parent, rootArgs, context, info): Promise<TypedJSONObject> => {
  // On the client this comes through as info.field, but in GraphiQL in comes
  // through as info.fieldNodes[0], so we need to support both.
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  if (!rootArgs.ids) {
    throw new NoRootIdsArgumentError(rootNode.name.value);
  }

  let model = null;

  try {
    const typename = singularize(firstLetterToUpper(rootNode.name.value));
    const idGroups = chunk(rootArgs.ids, MAX_BATCH_URLS);
    const responses = await Promise.all(
      idGroups.map((ids) => {
        return safeTrelloFetch(
          queryToBatchApiUrl(rootNode, rootArgs, ids),
          undefined,
          {
            clientVersion: context.clientAwareness.version,
            networkRequestEventAttributes: {
              source: 'graphql',
              resolver: typename,
              operationName: context.operationName,
            },
          },
        );
      }),
    );

    let groupNumber = 0;
    for (const response of responses) {
      if (response.ok) {
        const batchedResult = await response.json();
        const groupResult = batchedResult
          .filter((result: JSONObject) => result['200'])
          .map((result: JSONObject) => result['200']);
        model = !model ? groupResult : [...model, ...groupResult];
        idGroups[groupNumber].map((id, index) => {
          const resultId = batchedResult[index]['200']?.id;
          if (isShortLink(id) && resultId) {
            if (typename === 'Board') {
              idCache.setBoardId(id, resultId);
            }
            if (typename === 'Card') {
              idCache.setCardId(id, resultId);
            }
          }
        });
      } else {
        const error = await parseNetworkError(response);
        throw new BatchApiError(error, response);
      }
      groupNumber++;
    }

    return model
      ? (prepareDataForApolloCache(model, rootNode) as TypedJSONObject)
      : model;
  } catch (err) {
    if (err instanceof BatchApiError) {
      reportError(err.networkError, err.response.url, context.operationName);
    } else {
      reportError(err as Error | string, 'unknown', context.operationName);
    }

    /**
     * Previously, errors were ignored and we just returned the model. If you
     * want to handle errors in your component, you can use context.returnNetworkErrors true
     * and it will hit this point, which will populate the error field allowing you to use it.
     * Otherwise, you can not handle errors and rely on error reporting to splunk to diagnose
     * issues that come up in production.
     */
    if (context.returnNetworkErrors) {
      if (err instanceof BatchApiError) {
        throw new ApolloError({
          networkError: err.networkError,
          graphQLErrors: [],
          errorMessage: err.networkError.message,
        });
      } else if (err instanceof Error) {
        throw new ApolloError({
          graphQLErrors: [],
          errorMessage: err.message,
          clientErrors: [err],
        });
      }
    }

    return model;
  }
};
