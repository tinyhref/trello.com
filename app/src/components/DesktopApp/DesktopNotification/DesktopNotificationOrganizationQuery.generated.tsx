import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const DesktopNotificationOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DesktopNotificationOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"DesktopNotificationOrganization","document":DesktopNotificationOrganizationDocument}} as const;
export type DesktopNotificationOrganizationQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID']['input'];
}>;


export type DesktopNotificationOrganizationQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'url'>
  )> }
);

/**
 * __useDesktopNotificationOrganizationQuery__
 *
 * To run a query within a React component, call `useDesktopNotificationOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useDesktopNotificationOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDesktopNotificationOrganizationQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useDesktopNotificationOrganizationQuery(
  baseOptions: TrelloQueryHookOptions<
    DesktopNotificationOrganizationQuery,
    DesktopNotificationOrganizationQueryVariables
  > &
    (
      | {
          variables: DesktopNotificationOrganizationQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: DesktopNotificationOrganizationDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    DesktopNotificationOrganizationQuery,
    DesktopNotificationOrganizationQueryVariables
  >(DesktopNotificationOrganizationDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useDesktopNotificationOrganizationLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    DesktopNotificationOrganizationQuery,
    DesktopNotificationOrganizationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DesktopNotificationOrganizationQuery,
    DesktopNotificationOrganizationQueryVariables
  >(DesktopNotificationOrganizationDocument, options);
}
export function useDesktopNotificationOrganizationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        DesktopNotificationOrganizationQuery,
        DesktopNotificationOrganizationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    DesktopNotificationOrganizationQuery,
    DesktopNotificationOrganizationQueryVariables
  >(DesktopNotificationOrganizationDocument, options);
}
export type DesktopNotificationOrganizationQueryHookResult = ReturnType<
  typeof useDesktopNotificationOrganizationQuery
>;
export type DesktopNotificationOrganizationLazyQueryHookResult = ReturnType<
  typeof useDesktopNotificationOrganizationLazyQuery
>;
export type DesktopNotificationOrganizationSuspenseQueryHookResult = ReturnType<
  typeof useDesktopNotificationOrganizationSuspenseQuery
>;
export type DesktopNotificationOrganizationQueryResult = Apollo.QueryResult<
  DesktopNotificationOrganizationQuery,
  DesktopNotificationOrganizationQueryVariables
>;
