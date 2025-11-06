import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const WorkspaceUserLimitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceUserLimit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"collaborators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"WorkspaceUserLimit","document":WorkspaceUserLimitDocument}} as const;
export type WorkspaceUserLimitQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['ID']['input'];
}>;


export type WorkspaceUserLimitQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
    & {
      collaborators: Array<(
        { __typename: 'Collaborator' }
        & Pick<Types.Collaborator, 'id'>
      )>,
      members: Array<(
        { __typename: 'Member' }
        & Pick<Types.Member, 'id'>
      )>,
    }
  )> }
);

/**
 * __useWorkspaceUserLimitQuery__
 *
 * To run a query within a React component, call `useWorkspaceUserLimitQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceUserLimitQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceUserLimitQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useWorkspaceUserLimitQuery(
  baseOptions: TrelloQueryHookOptions<
    WorkspaceUserLimitQuery,
    WorkspaceUserLimitQueryVariables
  > &
    (
      | { variables: WorkspaceUserLimitQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: WorkspaceUserLimitDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    WorkspaceUserLimitQuery,
    WorkspaceUserLimitQueryVariables
  >(WorkspaceUserLimitDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useWorkspaceUserLimitLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    WorkspaceUserLimitQuery,
    WorkspaceUserLimitQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    WorkspaceUserLimitQuery,
    WorkspaceUserLimitQueryVariables
  >(WorkspaceUserLimitDocument, options);
}
export function useWorkspaceUserLimitSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        WorkspaceUserLimitQuery,
        WorkspaceUserLimitQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WorkspaceUserLimitQuery,
    WorkspaceUserLimitQueryVariables
  >(WorkspaceUserLimitDocument, options);
}
export type WorkspaceUserLimitQueryHookResult = ReturnType<
  typeof useWorkspaceUserLimitQuery
>;
export type WorkspaceUserLimitLazyQueryHookResult = ReturnType<
  typeof useWorkspaceUserLimitLazyQuery
>;
export type WorkspaceUserLimitSuspenseQueryHookResult = ReturnType<
  typeof useWorkspaceUserLimitSuspenseQuery
>;
export type WorkspaceUserLimitQueryResult = Apollo.QueryResult<
  WorkspaceUserLimitQuery,
  WorkspaceUserLimitQueryVariables
>;
