import type { FetchResult, NextLink, Operation } from '@apollo/client/core';
import { ApolloError, ApolloLink, Observable } from '@apollo/client/core';
import { isSubscriptionOperation } from '@apollo/client/utilities';
import debounce from 'debounce';

import { Analytics } from '@trello/atlassian-analytics';
import { sendErrorEvent } from '@trello/error-reporting';
import { dangerouslyGetFeatureGateSync } from '@trello/feature-gate-client';
import { safelyUpdateGraphqlWebsocketState } from '@trello/web-sockets';

import { cache } from '../cache';
import { sequenceNumberState } from '../sequenceNumberState';
import { queryFromPojo } from '../syncDeltaToCache/queryFromPojo';
import { extractObjectIdFromAri } from '../syncNativeToRest/getObjectIdFromCacheObject';
import type { JSONArray, JSONObject, JSONValue } from '../types';
import { getUniqueSubscriptionKey } from './utils/getUniqueSubscriptionKey';
import {
  getMappedSubscriptionTypename,
  shouldMapSubscriptionTypename,
} from './subscriptionTypenameMappings';

// NOTE: typeof [] === 'object'
const isObjectOrArray = (node: JSONValue): node is JSONArray | JSONObject =>
  typeof node === 'object';

const debouncedBroadcast = debounce(() => {
  // @ts-expect-error
  cache.broadcastWatches();
}, 100);

const getPathToNode = (parentKey: string, key: string): string => {
  const isRoot = parentKey === '';
  return isRoot ? key : `${parentKey}.${key}`;
};

const DELETION_TYPES = new Set<string>([
  'TrelloActionDeleted',
  'TrelloCardDeleted',
  'TrelloChecklistDeleted',
  'TrelloCustomFieldDeleted',
  'TrelloLabelDeleted',
  'TrelloPlannerCalendarDeleted',
  'TrelloPlannerCalendarEventCardDeleted',
  'TrelloProviderCalendarDeleted',
]);

const isDeletionType = (typename: string) => DELETION_TYPES.has(typename);

const deleteFromCache = (node: JSONObject) => {
  let objectId: string | undefined;
  let nonNativeType: string;

  // Special handling for actions, for two reasons:
  // 1. We use a single type 'TrelloActionDeleted' to represent all actions
  //    which means we don't have the typename of the action to delete
  //    which means we can't delete the native action
  // 2. We don't have ARIs for actions yet so using id?.split('/').pop()
  //    will not get us the object ID of the action
  if (node.__typename === 'TrelloActionDeleted') {
    if (typeof node.id === 'string') {
      objectId = node.id.includes('/')
        ? extractObjectIdFromAri(node.id)
        : node.id;
    }
    nonNativeType = 'Action';
  } else {
    node.__typename = getMappedSubscriptionTypename(node.__typename as string);
    const id = cache.identify(node);
    cache.evict({ id });

    const nativeToNonNativeTypeMap: Record<string, string> = {
      TrelloCard: 'Card',
      TrelloChecklist: 'Checklist',
      TrelloCustomField: 'CustomField',
      TrelloLabel: 'Label',
    };

    objectId = id?.split('/').pop();
    nonNativeType = nativeToNonNativeTypeMap[node.__typename];
  }

  // Cache syncing
  if (objectId && nonNativeType) {
    cache.evict({
      id: cache.identify({ id: objectId, __typename: nonNativeType }),
    });
  }
};

/**
 * Given an update object, go through the keys and execute
 * any side effects (mostly cache evictions). Return the keys corresponding
 * to the side effect events.
 */
const executeSideEffects = (object: JSONObject): string[] => {
  const sideEffectKeys = new Set<string>();

  Object.entries(object).forEach(([key, entry]) => {
    if (!Array.isArray(entry)) {
      return;
    }

    // Handle deletion events
    entry.forEach((item) => {
      if (item === null || !isObjectOrArray(item) || Array.isArray(item)) {
        return;
      }

      const typename = item.__typename;
      if (typeof typename !== 'string') {
        return;
      }

      if (isDeletionType(typename)) {
        deleteFromCache(item);
        sideEffectKeys.add(key);
      }
    });
  });

  return [...sideEffectKeys];
};

// Return the subscriptionName, operationName, and ids to track
// the number of channels we're creating. Manually select these
// variables so we don't accidentally send UGC in analytics.
export const getSubscriptionAnalyticsAttributes = (
  subscriptionName: string,
  mutableOperation: {
    operationName?: string;
    variables?: {
      nodeId?: string;
      nodeIds?: string[];
      memberId?: string;
      boardId?: string;
    };
  },
) => {
  const {
    operationName,
    variables: { nodeId, nodeIds = [], memberId, boardId } = {},
  } = mutableOperation;

  return {
    subscriptionName,
    ...(operationName && { operationName }),
    ...(nodeId && { nodeId }),
    ...(nodeIds.length > 0 && { nodeIds }),
    ...(memberId && { memberId }),
    ...(boardId && { boardId }),
  };
};

/**
 * Return a new object with valid values from the subscription response. Recurse through
 * the original response and use deltas to validate null values. Also, strip 'Updated'
 * from typenames to update normalized entities in the cache.
 *
 * See: https://hello.atlassian.net/wiki/spaces/TRFC/pages/4020701349
 *
 * @param {JSONObject | JSONArray} currentNode The current node to traverse in the subscription response
 * @param {string} parentKey The flattened path to the node in dot notation
 * @param {string[]} deltas The list of valid values in the array
 * @returns {JSONObject | JSONArray} A new object with cleaned subscription response
 */
export function cleanSubscriptionResponse(
  currentNode: JSONArray | JSONObject,
  parentKey: string,
  deltas: string[] | null,
): JSONArray | JSONObject {
  // Handle first function call if non-object is passed in
  // Otherwise, we only recurse through objects and arrays
  if (currentNode === null || !isObjectOrArray(currentNode)) {
    return currentNode;
  }

  // deltas is null on the initial subscription response, or "hydration."
  // On the initial response, don't skip any values.  Thereafter, skip values
  // if key is not included in deltas.
  const skipValue = (key: string) =>
    deltas === null ? false : !deltas.includes(key);

  // If array, iterate over elements
  if (Array.isArray(currentNode)) {
    const newArrayNode: JSONArray = [];
    currentNode.forEach((item, index) => {
      const newKey = getPathToNode(parentKey, String(index));
      if (item !== null && isObjectOrArray(item)) {
        // If item is object or array, recurse
        newArrayNode[index] = cleanSubscriptionResponse(item, newKey, deltas);
      } else if (item === null && skipValue(newKey)) {
        // If deltas is provided, Skip null values not contained therein
      } else {
        // Copy value to new node
        newArrayNode[index] = item;
      }
    });

    return newArrayNode;
  }

  // If object, iterate through keys
  const sideEffectKeys = executeSideEffects(currentNode);
  const keysToWrite = Object.keys(currentNode).filter(
    (key) => key !== '_deltas' && !sideEffectKeys.includes(key),
  );

  const newObjectNode: JSONObject = {};
  keysToWrite.forEach((key) => {
    const newKey = getPathToNode(parentKey, key);
    const item = currentNode[key];

    if (item !== null && isObjectOrArray(item)) {
      const cleanedData = cleanSubscriptionResponse(item, newKey, deltas);
      newObjectNode[key] = cleanedData;
    } else if (item === null && skipValue(newKey)) {
      // If deltas is provided, Skip null values not contained therein
    } else if (
      key === '__typename' &&
      typeof item === 'string' &&
      shouldMapSubscriptionTypename(item)
    ) {
      newObjectNode[key] = getMappedSubscriptionTypename(item);
    } else {
      // Copy value to new node
      newObjectNode[key] = item;
    }
  });

  return newObjectNode;
}

/**
 * Temporary solution to process subscription responses coming through native GraphQL,
 * while they have separate type and _deltas property on them.
 *
 * This is an Apollo link for ws messages the inspects the data and validates
 * null values based on their existence in _deltas. This handles server's
 * partial updates and writes them to the cache.
 * @example
 * const client = new ApolloClient({
 *   cache: new InMemoryCache(),
 *   link: ApolloLink.from([cacheSubscriptionResponseLink, httpLink]),
 * });
 *
 * @param {Operation} operation The GraphQL operation being executed.
 * @param {NextLink} forward A function that forwards the operation to the next link in the chain.
 * @returns {Observable<FetchResult>} An observable that emits the result of the operation.
 */
export const cacheSubscriptionResponseLink = new ApolloLink(
  (operation: Operation, forward: NextLink) => {
    // Check if the operation contains a subscription
    if (!isSubscriptionOperation(operation.query)) {
      return forward(operation);
    }

    // Deep copy the operation
    const operationCopy: Operation = JSON.parse(JSON.stringify(operation));

    // Process the operation and its result here
    return new Observable((observer) => {
      let traceId: string | null = Analytics.startTask({
        taskName: 'create-subscription/socket/graphql',
        source: '@trello/graphql',
      });

      operationCopy.extensions.trello = {
        traceId,
      };

      const isFeatureGateEnabled = dangerouslyGetFeatureGateSync(
        'goo_sequence_number_replays',
      );

      const subscription = forward(operationCopy).subscribe({
        next: (result: FetchResult) => {
          if (result.data) {
            // There's only one root subscription at a time. Get the
            // subscriptionName, and then get its data.
            const subscriptionName = Object.keys(result.data.trello)[0];
            const operationName = operationCopy.operationName;
            const variables = operationCopy.variables;
            if (isFeatureGateEnabled) {
              const key = getUniqueSubscriptionKey(operationName, variables);
              const currentSequenceNumber =
                result.extensions?.sequenceNumber ?? null;
              if (currentSequenceNumber !== null) {
                sequenceNumberState.setValue((prev) => ({
                  ...prev,
                  [key]: currentSequenceNumber,
                }));
              }
            }

            if (traceId) {
              Analytics.taskSucceeded({
                taskName: 'create-subscription/socket/graphql',
                source: '@trello/graphql',
                traceId,
                attributes: getSubscriptionAnalyticsAttributes(
                  subscriptionName,
                  operationCopy,
                ),
              });
              traceId = null;
            }

            const data = result.data.trello[subscriptionName];

            const id = data.id;

            // The subscription response can't be trusted because it may have null fields that were
            // not included in server's partial update. Delete all null fields unless they were
            // explicitly included in _deltas
            const cleanedData = {
              trello: {
                [subscriptionName]: cleanSubscriptionResponse(
                  data,
                  '',
                  data._deltas,
                ),
              },
            };

            try {
              /**
               * First try to write the query including the field arguments
               * if the feature gate is enabled. If something fails,
               * then we'll try again without the field arguments and
               * send an error to sentry which we can use to track
               * down the issue.
               *
               * We added this because the change is a bit risky and otherwise
               * we don't have great visibility into any errors.
               */
              cache.writeQuery({
                query: queryFromPojo(cleanedData, { id }, operationCopy),
                data: cleanedData,
                variables: { id },
                broadcast: false, // don't broadcast every single update
              });
            } catch (error) {
              cache.writeQuery({
                query: queryFromPojo(cleanedData, { id }),
                data: cleanedData,
                variables: { id },
                broadcast: false,
              });
              sendErrorEvent({
                error: new Error(
                  `Error writing query with field arguments. OperationName: ${operation.operationName}. ${error}`,
                ),
                metadata: {
                  ownershipArea: 'trello-graphql-data',
                  feature: 'cacheSubscriptionResponseLink',
                },
              });
            }

            if (
              result.extensions?.trello.traceId &&
              result.extensions.trello.spanId
            ) {
              Analytics.taskSucceeded({
                taskName: 'send-message',
                source: '@trello/graphql',
                traceId: result.extensions.trello.traceId,
                spanId: result.extensions.trello.spanId,
                attributes: { id, subscriptionName },
              });
            }

            // broadcast every 100ms
            debouncedBroadcast();
          }

          observer.next(result);
        },
        error: (error) => {
          /**
           * If trello server responds to graphql-subscriptions with a 429 error,
           * then the websocket closes. We need to update the graphqlWebsocketState
           * here to disconnected to show a flag to the client indicating that
           * their realtime updates are disconnected.
           *
           * We aren't able to handle this in wsLink since the socket closes with
           * a 1000 code, which indicates normal closure.
           */
          if (
            error instanceof ApolloError &&
            error.graphQLErrors.some(
              (err) =>
                err.extensions?.statusCode === 429 ||
                err.message.includes('429') ||
                err.message === "Replay in seconds can't be in the future",
            )
          ) {
            sendErrorEvent({
              error,
              metadata: {
                ownershipArea: 'trello-graphql-data',
                feature: 'cacheSubscriptionResponseLink',
              },
            });
            safelyUpdateGraphqlWebsocketState('disconnected');
          }
          if (traceId) {
            Analytics.taskFailed({
              taskName: 'create-subscription/socket/graphql',
              source: '@trello/graphql',
              traceId,
              error,
              attributes: { operationName: operation.operationName },
            });
            traceId = null;
          }
          observer.error(error);
        },
        complete: () => {
          if (traceId) {
            Analytics.taskAborted({
              taskName: 'create-subscription/socket/graphql',
              source: '@trello/graphql',
              traceId,
              attributes: { operationName: operation.operationName },
            });
            traceId = null;
          }
          observer.complete();
        },
      });
      // Cleanup
      return () => {
        if (subscription) subscription.unsubscribe();
        if (traceId) {
          Analytics.taskAborted({
            taskName: 'create-subscription/socket/graphql',
            source: '@trello/graphql',
            traceId,
          });
        }
      };
    });
  },
);
