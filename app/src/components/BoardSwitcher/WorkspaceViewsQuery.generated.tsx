import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const WorkspaceViewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceViews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationViewsFilter"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationView_Filters"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"defaultValue":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"organizationViewsFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationViewsFilter"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationViews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationViewsFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationViewsFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"EnumValue","value":"name"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"views"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"defaultViewType"}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"WorkspaceViews","document":WorkspaceViewsDocument}} as const;
export type WorkspaceViewsQueryVariables = Types.Exact<{
  organizationViewsFilter?: Types.InputMaybe<Array<Types.OrganizationView_Filters> | Types.OrganizationView_Filters>;
  orgId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type WorkspaceViewsQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
    & { organizationViews: Array<(
      { __typename: 'OrganizationView' }
      & Pick<Types.OrganizationView, 'id' | 'name' | 'shortLink'>
      & {
        prefs: (
          { __typename: 'OrganizationView_Prefs' }
          & Pick<Types.OrganizationView_Prefs, 'permissionLevel'>
        ),
        views: Array<(
          { __typename: 'OrganizationView_View' }
          & Pick<Types.OrganizationView_View, 'id' | 'defaultViewType'>
        )>,
      }
    )> }
  )> }
);

/**
 * __useWorkspaceViewsQuery__
 *
 * To run a query within a React component, call `useWorkspaceViewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceViewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceViewsQuery({
 *   variables: {
 *      organizationViewsFilter: // value for 'organizationViewsFilter'
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useWorkspaceViewsQuery(
  baseOptions?: TrelloQueryHookOptions<
    WorkspaceViewsQuery,
    WorkspaceViewsQueryVariables
  >,
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: WorkspaceViewsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    WorkspaceViewsQuery,
    WorkspaceViewsQueryVariables
  >(WorkspaceViewsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useWorkspaceViewsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    WorkspaceViewsQuery,
    WorkspaceViewsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<WorkspaceViewsQuery, WorkspaceViewsQueryVariables>(
    WorkspaceViewsDocument,
    options,
  );
}
export function useWorkspaceViewsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        WorkspaceViewsQuery,
        WorkspaceViewsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WorkspaceViewsQuery,
    WorkspaceViewsQueryVariables
  >(WorkspaceViewsDocument, options);
}
export type WorkspaceViewsQueryHookResult = ReturnType<
  typeof useWorkspaceViewsQuery
>;
export type WorkspaceViewsLazyQueryHookResult = ReturnType<
  typeof useWorkspaceViewsLazyQuery
>;
export type WorkspaceViewsSuspenseQueryHookResult = ReturnType<
  typeof useWorkspaceViewsSuspenseQuery
>;
export type WorkspaceViewsQueryResult = Apollo.QueryResult<
  WorkspaceViewsQuery,
  WorkspaceViewsQueryVariables
>;
