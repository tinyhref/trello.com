import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const LoggedOutHeaderOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoggedOutHeaderOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"LoggedOutHeaderOrganization","document":LoggedOutHeaderOrganizationDocument}} as const;
export type LoggedOutHeaderOrganizationQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID']['input'];
}>;


export type LoggedOutHeaderOrganizationQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id' | 'memberType'>
    )> }
  )> }
);

/**
 * __useLoggedOutHeaderOrganizationQuery__
 *
 * To run a query within a React component, call `useLoggedOutHeaderOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoggedOutHeaderOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoggedOutHeaderOrganizationQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useLoggedOutHeaderOrganizationQuery(
  baseOptions: TrelloQueryHookOptions<
    LoggedOutHeaderOrganizationQuery,
    LoggedOutHeaderOrganizationQueryVariables
  > &
    (
      | { variables: LoggedOutHeaderOrganizationQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: LoggedOutHeaderOrganizationDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    LoggedOutHeaderOrganizationQuery,
    LoggedOutHeaderOrganizationQueryVariables
  >(LoggedOutHeaderOrganizationDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useLoggedOutHeaderOrganizationLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    LoggedOutHeaderOrganizationQuery,
    LoggedOutHeaderOrganizationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    LoggedOutHeaderOrganizationQuery,
    LoggedOutHeaderOrganizationQueryVariables
  >(LoggedOutHeaderOrganizationDocument, options);
}
export function useLoggedOutHeaderOrganizationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        LoggedOutHeaderOrganizationQuery,
        LoggedOutHeaderOrganizationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    LoggedOutHeaderOrganizationQuery,
    LoggedOutHeaderOrganizationQueryVariables
  >(LoggedOutHeaderOrganizationDocument, options);
}
export type LoggedOutHeaderOrganizationQueryHookResult = ReturnType<
  typeof useLoggedOutHeaderOrganizationQuery
>;
export type LoggedOutHeaderOrganizationLazyQueryHookResult = ReturnType<
  typeof useLoggedOutHeaderOrganizationLazyQuery
>;
export type LoggedOutHeaderOrganizationSuspenseQueryHookResult = ReturnType<
  typeof useLoggedOutHeaderOrganizationSuspenseQuery
>;
export type LoggedOutHeaderOrganizationQueryResult = Apollo.QueryResult<
  LoggedOutHeaderOrganizationQuery,
  LoggedOutHeaderOrganizationQueryVariables
>;
