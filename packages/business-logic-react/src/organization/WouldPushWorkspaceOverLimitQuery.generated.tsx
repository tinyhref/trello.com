import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const WouldPushWorkspaceOverLimitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WouldPushWorkspaceOverLimit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"collaborators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"WouldPushWorkspaceOverLimit","document":WouldPushWorkspaceOverLimitDocument}} as const;
export type WouldPushWorkspaceOverLimitQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['ID']['input'];
}>;


export type WouldPushWorkspaceOverLimitQuery = (
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
 * __useWouldPushWorkspaceOverLimitQuery__
 *
 * To run a query within a React component, call `useWouldPushWorkspaceOverLimitQuery` and pass it any options that fit your needs.
 * When your component renders, `useWouldPushWorkspaceOverLimitQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWouldPushWorkspaceOverLimitQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useWouldPushWorkspaceOverLimitQuery(
  baseOptions: TrelloQueryHookOptions<
    WouldPushWorkspaceOverLimitQuery,
    WouldPushWorkspaceOverLimitQueryVariables
  > &
    (
      | { variables: WouldPushWorkspaceOverLimitQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: WouldPushWorkspaceOverLimitDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    WouldPushWorkspaceOverLimitQuery,
    WouldPushWorkspaceOverLimitQueryVariables
  >(WouldPushWorkspaceOverLimitDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useWouldPushWorkspaceOverLimitLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    WouldPushWorkspaceOverLimitQuery,
    WouldPushWorkspaceOverLimitQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    WouldPushWorkspaceOverLimitQuery,
    WouldPushWorkspaceOverLimitQueryVariables
  >(WouldPushWorkspaceOverLimitDocument, options);
}
export function useWouldPushWorkspaceOverLimitSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        WouldPushWorkspaceOverLimitQuery,
        WouldPushWorkspaceOverLimitQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WouldPushWorkspaceOverLimitQuery,
    WouldPushWorkspaceOverLimitQueryVariables
  >(WouldPushWorkspaceOverLimitDocument, options);
}
export type WouldPushWorkspaceOverLimitQueryHookResult = ReturnType<
  typeof useWouldPushWorkspaceOverLimitQuery
>;
export type WouldPushWorkspaceOverLimitLazyQueryHookResult = ReturnType<
  typeof useWouldPushWorkspaceOverLimitLazyQuery
>;
export type WouldPushWorkspaceOverLimitSuspenseQueryHookResult = ReturnType<
  typeof useWouldPushWorkspaceOverLimitSuspenseQuery
>;
export type WouldPushWorkspaceOverLimitQueryResult = Apollo.QueryResult<
  WouldPushWorkspaceOverLimitQuery,
  WouldPushWorkspaceOverLimitQueryVariables
>;
