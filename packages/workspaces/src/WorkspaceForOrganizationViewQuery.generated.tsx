import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const WorkspaceForOrganizationViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceForOrganizationView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrganizationView"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrganizationView"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"WorkspaceForOrganizationView","document":WorkspaceForOrganizationViewDocument}} as const;
export type WorkspaceForOrganizationViewQueryVariables = Types.Exact<{
  idOrganizationView: Types.Scalars['ID']['input'];
}>;


export type WorkspaceForOrganizationViewQuery = (
  { __typename: 'Query' }
  & { organizationView?: Types.Maybe<(
    { __typename: 'OrganizationView' }
    & Pick<Types.OrganizationView, 'id' | 'idOrganization'>
  )> }
);

/**
 * __useWorkspaceForOrganizationViewQuery__
 *
 * To run a query within a React component, call `useWorkspaceForOrganizationViewQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceForOrganizationViewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceForOrganizationViewQuery({
 *   variables: {
 *      idOrganizationView: // value for 'idOrganizationView'
 *   },
 * });
 */
export function useWorkspaceForOrganizationViewQuery(
  baseOptions: TrelloQueryHookOptions<
    WorkspaceForOrganizationViewQuery,
    WorkspaceForOrganizationViewQueryVariables
  > &
    (
      | {
          variables: WorkspaceForOrganizationViewQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: WorkspaceForOrganizationViewDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    WorkspaceForOrganizationViewQuery,
    WorkspaceForOrganizationViewQueryVariables
  >(WorkspaceForOrganizationViewDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useWorkspaceForOrganizationViewLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    WorkspaceForOrganizationViewQuery,
    WorkspaceForOrganizationViewQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    WorkspaceForOrganizationViewQuery,
    WorkspaceForOrganizationViewQueryVariables
  >(WorkspaceForOrganizationViewDocument, options);
}
export function useWorkspaceForOrganizationViewSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        WorkspaceForOrganizationViewQuery,
        WorkspaceForOrganizationViewQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WorkspaceForOrganizationViewQuery,
    WorkspaceForOrganizationViewQueryVariables
  >(WorkspaceForOrganizationViewDocument, options);
}
export type WorkspaceForOrganizationViewQueryHookResult = ReturnType<
  typeof useWorkspaceForOrganizationViewQuery
>;
export type WorkspaceForOrganizationViewLazyQueryHookResult = ReturnType<
  typeof useWorkspaceForOrganizationViewLazyQuery
>;
export type WorkspaceForOrganizationViewSuspenseQueryHookResult = ReturnType<
  typeof useWorkspaceForOrganizationViewSuspenseQuery
>;
export type WorkspaceForOrganizationViewQueryResult = Apollo.QueryResult<
  WorkspaceForOrganizationViewQuery,
  WorkspaceForOrganizationViewQueryVariables
>;
