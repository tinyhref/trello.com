import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const EnterprisesWithStandingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EnterprisesWithStanding"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enterpriseIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enterpriseIds"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterpriseStanding"}},{"kind":"Field","name":{"kind":"Name","value":"pendingDeprovision"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"EnterprisesWithStanding","document":EnterprisesWithStandingDocument}} as const;
export type EnterprisesWithStandingQueryVariables = Types.Exact<{
  enterpriseIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type EnterprisesWithStandingQuery = (
  { __typename: 'Query' }
  & { enterprises: Array<(
    { __typename: 'Enterprise' }
    & Pick<Types.Enterprise, 'id' | 'displayName'>
    & { paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<Types.PaidAccount, 'enterpriseStanding' | 'pendingDeprovision'>
    )> }
  )> }
);

/**
 * __useEnterprisesWithStandingQuery__
 *
 * To run a query within a React component, call `useEnterprisesWithStandingQuery` and pass it any options that fit your needs.
 * When your component renders, `useEnterprisesWithStandingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEnterprisesWithStandingQuery({
 *   variables: {
 *      enterpriseIds: // value for 'enterpriseIds'
 *   },
 * });
 */
export function useEnterprisesWithStandingQuery(
  baseOptions: TrelloQueryHookOptions<
    EnterprisesWithStandingQuery,
    EnterprisesWithStandingQueryVariables
  > &
    (
      | { variables: EnterprisesWithStandingQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: EnterprisesWithStandingDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    EnterprisesWithStandingQuery,
    EnterprisesWithStandingQueryVariables
  >(EnterprisesWithStandingDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useEnterprisesWithStandingLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    EnterprisesWithStandingQuery,
    EnterprisesWithStandingQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    EnterprisesWithStandingQuery,
    EnterprisesWithStandingQueryVariables
  >(EnterprisesWithStandingDocument, options);
}
export function useEnterprisesWithStandingSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        EnterprisesWithStandingQuery,
        EnterprisesWithStandingQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    EnterprisesWithStandingQuery,
    EnterprisesWithStandingQueryVariables
  >(EnterprisesWithStandingDocument, options);
}
export type EnterprisesWithStandingQueryHookResult = ReturnType<
  typeof useEnterprisesWithStandingQuery
>;
export type EnterprisesWithStandingLazyQueryHookResult = ReturnType<
  typeof useEnterprisesWithStandingLazyQuery
>;
export type EnterprisesWithStandingSuspenseQueryHookResult = ReturnType<
  typeof useEnterprisesWithStandingSuspenseQuery
>;
export type EnterprisesWithStandingQueryResult = Apollo.QueryResult<
  EnterprisesWithStandingQuery,
  EnterprisesWithStandingQueryVariables
>;
