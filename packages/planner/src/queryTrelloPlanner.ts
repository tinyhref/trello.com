import type { ApolloQueryResult, QueryOptions } from '@apollo/client/core';

import { client } from '@trello/graphql';

import {
  TrelloPlannerDocument,
  type TrelloPlannerQuery,
  type TrelloPlannerQueryVariables,
} from './TrelloPlannerQuery.generated';

/**
 * This is an imperative helper for querying the Trello Planner query.
 * Other use cases will use `useTrelloPlannerQuery` directly from the generate hooks.
 *
 * @param variables - The variables for the query.
 * @param context - The context for the query.
 * @returns The result of the query.
 */
export const queryTrelloPlanner = ({
  variables: { nodeId, start, end },
  context,
}: {
  variables: TrelloPlannerQueryVariables;
  context?: QueryOptions['context'];
}): Promise<ApolloQueryResult<TrelloPlannerQuery>> => {
  return client.query<TrelloPlannerQuery, TrelloPlannerQueryVariables>({
    query: TrelloPlannerDocument,
    variables: {
      nodeId,
      start,
      end,
    },
    // eslint-disable-next-line @trello/disallow-fetch-policies
    fetchPolicy: 'network-only',
    context,
  });
};
