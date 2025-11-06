import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const WorkspaceTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"WorkspaceType","document":WorkspaceTypeDocument}} as const;
export type WorkspaceTypeQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['ID']['input'];
}>;


export type WorkspaceTypeQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'type'>
  )> }
);

/**
 * __useWorkspaceTypeQuery__
 *
 * To run a query within a React component, call `useWorkspaceTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceTypeQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useWorkspaceTypeQuery(
  baseOptions: TrelloQueryHookOptions<
    WorkspaceTypeQuery,
    WorkspaceTypeQueryVariables
  > &
    (
      | { variables: WorkspaceTypeQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: WorkspaceTypeDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    WorkspaceTypeQuery,
    WorkspaceTypeQueryVariables
  >(WorkspaceTypeDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useWorkspaceTypeLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    WorkspaceTypeQuery,
    WorkspaceTypeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<WorkspaceTypeQuery, WorkspaceTypeQueryVariables>(
    WorkspaceTypeDocument,
    options,
  );
}
export function useWorkspaceTypeSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        WorkspaceTypeQuery,
        WorkspaceTypeQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WorkspaceTypeQuery,
    WorkspaceTypeQueryVariables
  >(WorkspaceTypeDocument, options);
}
export type WorkspaceTypeQueryHookResult = ReturnType<
  typeof useWorkspaceTypeQuery
>;
export type WorkspaceTypeLazyQueryHookResult = ReturnType<
  typeof useWorkspaceTypeLazyQuery
>;
export type WorkspaceTypeSuspenseQueryHookResult = ReturnType<
  typeof useWorkspaceTypeSuspenseQuery
>;
export type WorkspaceTypeQueryResult = Apollo.QueryResult<
  WorkspaceTypeQuery,
  WorkspaceTypeQueryVariables
>;
