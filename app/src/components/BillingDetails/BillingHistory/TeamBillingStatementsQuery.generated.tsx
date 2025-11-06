import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const TeamBillingStatementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamBillingStatements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationStatements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"item"}},{"kind":"Field","name":{"kind":"Name","value":"statementToken"}},{"kind":"Field","name":{"kind":"Name","value":"translationKey"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TeamBillingStatements","document":TeamBillingStatementsDocument}} as const;
export type TeamBillingStatementsQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID']['input'];
}>;


export type TeamBillingStatementsQuery = (
  { __typename: 'Query' }
  & { organizationStatements: Array<(
    { __typename: 'Statement' }
    & Pick<
      Types.Statement,
      | 'id'
      | 'amount'
      | 'date'
      | 'item'
      | 'statementToken'
      | 'translationKey'
    >
  )> }
);

/**
 * __useTeamBillingStatementsQuery__
 *
 * To run a query within a React component, call `useTeamBillingStatementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamBillingStatementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamBillingStatementsQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useTeamBillingStatementsQuery(
  baseOptions: TrelloQueryHookOptions<
    TeamBillingStatementsQuery,
    TeamBillingStatementsQueryVariables
  > &
    (
      | { variables: TeamBillingStatementsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: TeamBillingStatementsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    TeamBillingStatementsQuery,
    TeamBillingStatementsQueryVariables
  >(TeamBillingStatementsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useTeamBillingStatementsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    TeamBillingStatementsQuery,
    TeamBillingStatementsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    TeamBillingStatementsQuery,
    TeamBillingStatementsQueryVariables
  >(TeamBillingStatementsDocument, options);
}
export function useTeamBillingStatementsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        TeamBillingStatementsQuery,
        TeamBillingStatementsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    TeamBillingStatementsQuery,
    TeamBillingStatementsQueryVariables
  >(TeamBillingStatementsDocument, options);
}
export type TeamBillingStatementsQueryHookResult = ReturnType<
  typeof useTeamBillingStatementsQuery
>;
export type TeamBillingStatementsLazyQueryHookResult = ReturnType<
  typeof useTeamBillingStatementsLazyQuery
>;
export type TeamBillingStatementsSuspenseQueryHookResult = ReturnType<
  typeof useTeamBillingStatementsSuspenseQuery
>;
export type TeamBillingStatementsQueryResult = Apollo.QueryResult<
  TeamBillingStatementsQuery,
  TeamBillingStatementsQueryVariables
>;
