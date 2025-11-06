import {
  type ApolloCache,
  type NormalizedCacheObject,
  type OperationVariables,
  type TypedDocumentNode,
} from '@apollo/client';

import type { JSONArray, JSONObject } from '../types';
import {
  TrelloBoardIdDocument,
  type TrelloBoardIdQuery,
  type TrelloBoardIdQueryVariables,
} from './TrelloBoardIdQuery.generated';
import {
  TrelloMemberIdDocument,
  type TrelloMemberIdQuery,
  type TrelloMemberIdQueryVariables,
} from './TrelloMemberIdQuery.generated';
import {
  TrelloWorkspaceIdDocument,
  type TrelloWorkspaceIdQuery,
  type TrelloWorkspaceIdQueryVariables,
} from './TrelloWorkspaceIdQuery.generated';

export const SUPPORTED_TYPE_NAMES = [
  'TrelloBoard',
  'TrelloMember',
  'TrelloWorkspace',
] as const;

export type SupportedTypeNames = (typeof SUPPORTED_TYPE_NAMES)[number];

type HydrationQueryDefinition<TData, TVars extends OperationVariables> = {
  query: TypedDocumentNode<TData, TVars>;
  getArguments: (data: JSONObject) => TVars;
  getData: (data: JSONObject) => TData;
};

type BoardIdHydrationQueryDefinition = HydrationQueryDefinition<
  TrelloBoardIdQuery,
  TrelloBoardIdQueryVariables
>;

type MemberIdHydrationQueryDefinition = HydrationQueryDefinition<
  TrelloMemberIdQuery,
  TrelloMemberIdQueryVariables
>;

type WorkspaceIdHydrationQueryDefinition = HydrationQueryDefinition<
  TrelloWorkspaceIdQuery,
  TrelloWorkspaceIdQueryVariables
>;

type HydrationQueryDefinitionByType = {
  TrelloBoard: BoardIdHydrationQueryDefinition;
  TrelloMember: MemberIdHydrationQueryDefinition;
  TrelloWorkspace: WorkspaceIdHydrationQueryDefinition;
};

type HydrationQueryMap = {
  [K in SupportedTypeNames]: HydrationQueryDefinitionByType[K][];
};

/**
 * A map of supported types to their hydration query definitions.
 */
export const HYDRATION_QUERY_MAP: HydrationQueryMap = {
  TrelloBoard: [
    {
      query: TrelloBoardIdDocument,
      getArguments: (board: JSONObject) => ({ id: board.id as string }),
      getData: (board) => ({
        __typename: 'Query',
        trello: {
          __typename: 'TrelloQueryApi',
          board: {
            id: board.id as string,
            __typename: 'TrelloBoard',
          },
        },
      }),
    },
  ],
  TrelloMember: [
    {
      query: TrelloMemberIdDocument,
      getArguments: (member: JSONObject) => ({ id: member.id as string }),
      getData: (member) => ({
        __typename: 'Query',
        trello: {
          __typename: 'TrelloQueryApi',
          member: {
            id: member.id as string,
            __typename: 'TrelloMember',
          },
        },
      }),
    },
  ],
  TrelloWorkspace: [
    {
      query: TrelloWorkspaceIdDocument,
      getArguments: (workspace: JSONObject) => ({ id: workspace.id as string }),
      getData: (workspace) => ({
        __typename: 'Query',
        trello: {
          __typename: 'TrelloQueryApi',
          workspace: {
            id: workspace.id as string,
            __typename: 'TrelloWorkspace',
          },
        },
      }),
    },
  ],
};

export type OverHydrateCacheOptions = {
  lookupTypeNames?: SupportedTypeNames[];
};

/**
 * Recursively parses the 'data' object for nested objects with '__typename' and 'id' fields.
 * If '__typename' is in the 'lookupTypeNames' array, it finds the hydration query definitions for that type
 * and iterates through them.
 * Using the query and helper functions to build variables and response from the parsed object,
 * it checks if the cache already has the data for the query,
 * and if not, writes it to the cache.
 *
 * @param {ApolloCache<NormalizedCacheObject>} cache - The Apollo cache object
 * @param {Object} data - The response data from the quickload query that was already cached
 * @param {Object} [options] - The options for overHydrateCache function
 * @param {Array<SupportedTypeNames>} [options.lookupTypeNames] - An optional array of supported type names to limit the hydration process to specific types
 *
 * @example
 * const data = {
 *   trello: {
 *     'BoardByShortName': {
 *       __typename: 'TrelloBoard',
 *       id: '1',
 *       name: 'Board 1',
 *     },
 *     'me': {
 *       __typename: 'TrelloMember',
 *       id: '2',
 *       name: 'Member 2',
 *     },
 *   },
 * };
 *
 * overHydrateCache(cache, data);
 *
 * // The 'ROOT_QUERY' in cache will be updated like this:
 * // ROOT_QUERY: {
 * //   __typename: 'Query',
 * //   trello: {
 * //     __typename: 'TrelloQueryApi',
 * //     BoardByShortName: { __ref: 'TrelloBoard:1' },
 * //     me: { __ref: 'TrelloMember:2' },
 * //
 * //     // These board and member were added by the overHydration process
 * //     'board({"id":"1"})@optIn({"to":"TrelloBoard"})': {
 * //       __ref: 'TrelloBoard:1',
 * //     },
 * //     'member({"id":"2"})@optIn({"to":"TrelloMember"})': {
 * //       __ref: 'TrelloMember:2',
 * //     },
 * //   },
 * // },
 */
export const overHydrateCache = (
  cache: ApolloCache<NormalizedCacheObject>,
  data: { trello: JSONObject },
  options: OverHydrateCacheOptions = {},
) => {
  const { lookupTypeNames = ['TrelloBoard', 'TrelloWorkspace'] } = options;
  const { trello } = data;
  if (!trello) return;

  // Queue to keep track of objects to visit
  const queue: (JSONArray | JSONObject)[] = [trello];

  while (queue.length) {
    const obj = queue.shift();
    if (!obj || typeof obj !== 'object') {
      continue;
    }

    // Check if there are nested objects to visit or arrays to iterate
    // and add them to the queue
    if (Array.isArray(obj)) {
      obj.forEach((value) => {
        if (value && typeof value === 'object') {
          queue.push(value);
        }
      });
    } else if (typeof obj === 'object') {
      Object.values(obj).forEach((value) => {
        if (value && typeof value === 'object') {
          queue.push(value);
        }
      });

      if (obj.__typename && obj.id) {
        const typeName = obj.__typename as string;
        if (lookupTypeNames.includes(typeName as SupportedTypeNames)) {
          const hydrationQueries =
            HYDRATION_QUERY_MAP[typeName as SupportedTypeNames];
          if (hydrationQueries) {
            hydrationQueries.forEach((queryDefinition) => {
              const { query, getArguments, getData } = queryDefinition;
              const variables = getArguments(obj);
              const existingData = cache.readQuery({
                query,
                variables,
              });
              if (!existingData) {
                const newData = getData(obj);
                cache.writeQuery({
                  query,
                  data: newData,
                  variables,
                  broadcast: false,
                });
              }
            });
          }
        }
      }
    }
  }
};
