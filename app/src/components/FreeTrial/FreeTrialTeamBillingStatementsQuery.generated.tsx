import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const FreeTrialTeamBillingStatementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FreeTrialTeamBillingStatements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationStatements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"item"}},{"kind":"Field","name":{"kind":"Name","value":"statementToken"}},{"kind":"Field","name":{"kind":"Name","value":"translationKey"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"FreeTrialTeamBillingStatements","document":FreeTrialTeamBillingStatementsDocument}} as const;
export type FreeTrialTeamBillingStatementsQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID']['input'];
}>;


export type FreeTrialTeamBillingStatementsQuery = (
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
 * __useFreeTrialTeamBillingStatementsQuery__
 *
 * To run a query within a React component, call `useFreeTrialTeamBillingStatementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFreeTrialTeamBillingStatementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFreeTrialTeamBillingStatementsQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useFreeTrialTeamBillingStatementsQuery(
  baseOptions: TrelloQueryHookOptions<
    FreeTrialTeamBillingStatementsQuery,
    FreeTrialTeamBillingStatementsQueryVariables
  > &
    (
      | {
          variables: FreeTrialTeamBillingStatementsQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: FreeTrialTeamBillingStatementsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    FreeTrialTeamBillingStatementsQuery,
    FreeTrialTeamBillingStatementsQueryVariables
  >(FreeTrialTeamBillingStatementsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useFreeTrialTeamBillingStatementsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    FreeTrialTeamBillingStatementsQuery,
    FreeTrialTeamBillingStatementsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    FreeTrialTeamBillingStatementsQuery,
    FreeTrialTeamBillingStatementsQueryVariables
  >(FreeTrialTeamBillingStatementsDocument, options);
}
export function useFreeTrialTeamBillingStatementsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        FreeTrialTeamBillingStatementsQuery,
        FreeTrialTeamBillingStatementsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    FreeTrialTeamBillingStatementsQuery,
    FreeTrialTeamBillingStatementsQueryVariables
  >(FreeTrialTeamBillingStatementsDocument, options);
}
export type FreeTrialTeamBillingStatementsQueryHookResult = ReturnType<
  typeof useFreeTrialTeamBillingStatementsQuery
>;
export type FreeTrialTeamBillingStatementsLazyQueryHookResult = ReturnType<
  typeof useFreeTrialTeamBillingStatementsLazyQuery
>;
export type FreeTrialTeamBillingStatementsSuspenseQueryHookResult = ReturnType<
  typeof useFreeTrialTeamBillingStatementsSuspenseQuery
>;
export type FreeTrialTeamBillingStatementsQueryResult = Apollo.QueryResult<
  FreeTrialTeamBillingStatementsQuery,
  FreeTrialTeamBillingStatementsQueryVariables
>;
