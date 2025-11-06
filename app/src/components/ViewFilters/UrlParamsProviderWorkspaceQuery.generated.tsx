import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const UrlParamsProviderWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UrlParamsProviderWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UrlParamsProviderWorkspace","document":UrlParamsProviderWorkspaceDocument}} as const;
export type UrlParamsProviderWorkspaceQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['ID']['input'];
}>;


export type UrlParamsProviderWorkspaceQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'offering'>
  )> }
);

/**
 * __useUrlParamsProviderWorkspaceQuery__
 *
 * To run a query within a React component, call `useUrlParamsProviderWorkspaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useUrlParamsProviderWorkspaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUrlParamsProviderWorkspaceQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useUrlParamsProviderWorkspaceQuery(
  baseOptions: TrelloQueryHookOptions<
    UrlParamsProviderWorkspaceQuery,
    UrlParamsProviderWorkspaceQueryVariables
  > &
    (
      | { variables: UrlParamsProviderWorkspaceQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: UrlParamsProviderWorkspaceDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    UrlParamsProviderWorkspaceQuery,
    UrlParamsProviderWorkspaceQueryVariables
  >(UrlParamsProviderWorkspaceDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useUrlParamsProviderWorkspaceLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    UrlParamsProviderWorkspaceQuery,
    UrlParamsProviderWorkspaceQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    UrlParamsProviderWorkspaceQuery,
    UrlParamsProviderWorkspaceQueryVariables
  >(UrlParamsProviderWorkspaceDocument, options);
}
export function useUrlParamsProviderWorkspaceSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        UrlParamsProviderWorkspaceQuery,
        UrlParamsProviderWorkspaceQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    UrlParamsProviderWorkspaceQuery,
    UrlParamsProviderWorkspaceQueryVariables
  >(UrlParamsProviderWorkspaceDocument, options);
}
export type UrlParamsProviderWorkspaceQueryHookResult = ReturnType<
  typeof useUrlParamsProviderWorkspaceQuery
>;
export type UrlParamsProviderWorkspaceLazyQueryHookResult = ReturnType<
  typeof useUrlParamsProviderWorkspaceLazyQuery
>;
export type UrlParamsProviderWorkspaceSuspenseQueryHookResult = ReturnType<
  typeof useUrlParamsProviderWorkspaceSuspenseQuery
>;
export type UrlParamsProviderWorkspaceQueryResult = Apollo.QueryResult<
  UrlParamsProviderWorkspaceQuery,
  UrlParamsProviderWorkspaceQueryVariables
>;
