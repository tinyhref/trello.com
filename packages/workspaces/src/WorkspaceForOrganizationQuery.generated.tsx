import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const WorkspaceForOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceForOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"WorkspaceForOrganization","document":WorkspaceForOrganizationDocument}} as const;
export type WorkspaceForOrganizationQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID']['input'];
}>;


export type WorkspaceForOrganizationQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
  )> }
);

/**
 * __useWorkspaceForOrganizationQuery__
 *
 * To run a query within a React component, call `useWorkspaceForOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceForOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceForOrganizationQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useWorkspaceForOrganizationQuery(
  baseOptions: TrelloQueryHookOptions<
    WorkspaceForOrganizationQuery,
    WorkspaceForOrganizationQueryVariables
  > &
    (
      | { variables: WorkspaceForOrganizationQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: WorkspaceForOrganizationDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    WorkspaceForOrganizationQuery,
    WorkspaceForOrganizationQueryVariables
  >(WorkspaceForOrganizationDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useWorkspaceForOrganizationLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    WorkspaceForOrganizationQuery,
    WorkspaceForOrganizationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    WorkspaceForOrganizationQuery,
    WorkspaceForOrganizationQueryVariables
  >(WorkspaceForOrganizationDocument, options);
}
export function useWorkspaceForOrganizationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        WorkspaceForOrganizationQuery,
        WorkspaceForOrganizationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WorkspaceForOrganizationQuery,
    WorkspaceForOrganizationQueryVariables
  >(WorkspaceForOrganizationDocument, options);
}
export type WorkspaceForOrganizationQueryHookResult = ReturnType<
  typeof useWorkspaceForOrganizationQuery
>;
export type WorkspaceForOrganizationLazyQueryHookResult = ReturnType<
  typeof useWorkspaceForOrganizationLazyQuery
>;
export type WorkspaceForOrganizationSuspenseQueryHookResult = ReturnType<
  typeof useWorkspaceForOrganizationSuspenseQuery
>;
export type WorkspaceForOrganizationQueryResult = Apollo.QueryResult<
  WorkspaceForOrganizationQuery,
  WorkspaceForOrganizationQueryVariables
>;
