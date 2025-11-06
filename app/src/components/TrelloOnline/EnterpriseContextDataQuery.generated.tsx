import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const EnterpriseContextDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EnterpriseContextData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"EnterpriseContextData","document":EnterpriseContextDataDocument}} as const;
export type EnterpriseContextDataQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID']['input'];
}>;


export type EnterpriseContextDataQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
    & { enterprise?: Types.Maybe<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id'>
    )> }
  )> }
);

/**
 * __useEnterpriseContextDataQuery__
 *
 * To run a query within a React component, call `useEnterpriseContextDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useEnterpriseContextDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEnterpriseContextDataQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useEnterpriseContextDataQuery(
  baseOptions: TrelloQueryHookOptions<
    EnterpriseContextDataQuery,
    EnterpriseContextDataQueryVariables
  > &
    (
      | { variables: EnterpriseContextDataQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: EnterpriseContextDataDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    EnterpriseContextDataQuery,
    EnterpriseContextDataQueryVariables
  >(EnterpriseContextDataDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useEnterpriseContextDataLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    EnterpriseContextDataQuery,
    EnterpriseContextDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    EnterpriseContextDataQuery,
    EnterpriseContextDataQueryVariables
  >(EnterpriseContextDataDocument, options);
}
export function useEnterpriseContextDataSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        EnterpriseContextDataQuery,
        EnterpriseContextDataQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    EnterpriseContextDataQuery,
    EnterpriseContextDataQueryVariables
  >(EnterpriseContextDataDocument, options);
}
export type EnterpriseContextDataQueryHookResult = ReturnType<
  typeof useEnterpriseContextDataQuery
>;
export type EnterpriseContextDataLazyQueryHookResult = ReturnType<
  typeof useEnterpriseContextDataLazyQuery
>;
export type EnterpriseContextDataSuspenseQueryHookResult = ReturnType<
  typeof useEnterpriseContextDataSuspenseQuery
>;
export type EnterpriseContextDataQueryResult = Apollo.QueryResult<
  EnterpriseContextDataQuery,
  EnterpriseContextDataQueryVariables
>;
