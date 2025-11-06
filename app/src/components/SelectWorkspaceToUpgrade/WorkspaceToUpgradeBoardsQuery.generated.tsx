import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const WorkspaceToUpgradeBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceToUpgradeBoards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"WorkspaceToUpgradeBoards","document":WorkspaceToUpgradeBoardsDocument}} as const;
export type WorkspaceToUpgradeBoardsQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['ID']['input'];
}>;


export type WorkspaceToUpgradeBoardsQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id'>
    )> }
  )> }
);

/**
 * __useWorkspaceToUpgradeBoardsQuery__
 *
 * To run a query within a React component, call `useWorkspaceToUpgradeBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceToUpgradeBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceToUpgradeBoardsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useWorkspaceToUpgradeBoardsQuery(
  baseOptions: TrelloQueryHookOptions<
    WorkspaceToUpgradeBoardsQuery,
    WorkspaceToUpgradeBoardsQueryVariables
  > &
    (
      | { variables: WorkspaceToUpgradeBoardsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: WorkspaceToUpgradeBoardsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    WorkspaceToUpgradeBoardsQuery,
    WorkspaceToUpgradeBoardsQueryVariables
  >(WorkspaceToUpgradeBoardsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useWorkspaceToUpgradeBoardsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    WorkspaceToUpgradeBoardsQuery,
    WorkspaceToUpgradeBoardsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    WorkspaceToUpgradeBoardsQuery,
    WorkspaceToUpgradeBoardsQueryVariables
  >(WorkspaceToUpgradeBoardsDocument, options);
}
export function useWorkspaceToUpgradeBoardsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        WorkspaceToUpgradeBoardsQuery,
        WorkspaceToUpgradeBoardsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WorkspaceToUpgradeBoardsQuery,
    WorkspaceToUpgradeBoardsQueryVariables
  >(WorkspaceToUpgradeBoardsDocument, options);
}
export type WorkspaceToUpgradeBoardsQueryHookResult = ReturnType<
  typeof useWorkspaceToUpgradeBoardsQuery
>;
export type WorkspaceToUpgradeBoardsLazyQueryHookResult = ReturnType<
  typeof useWorkspaceToUpgradeBoardsLazyQuery
>;
export type WorkspaceToUpgradeBoardsSuspenseQueryHookResult = ReturnType<
  typeof useWorkspaceToUpgradeBoardsSuspenseQuery
>;
export type WorkspaceToUpgradeBoardsQueryResult = Apollo.QueryResult<
  WorkspaceToUpgradeBoardsQuery,
  WorkspaceToUpgradeBoardsQueryVariables
>;
