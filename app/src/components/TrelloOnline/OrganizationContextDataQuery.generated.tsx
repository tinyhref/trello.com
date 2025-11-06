import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const OrganizationContextDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationContextData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"billableMemberCount"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"teamType"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"OrganizationContextData","document":OrganizationContextDataDocument}} as const;
export type OrganizationContextDataQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID']['input'];
}>;


export type OrganizationContextDataQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<
      Types.Organization,
      | 'id'
      | 'billableMemberCount'
      | 'offering'
      | 'teamType'
    >
  )> }
);

/**
 * __useOrganizationContextDataQuery__
 *
 * To run a query within a React component, call `useOrganizationContextDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationContextDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationContextDataQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useOrganizationContextDataQuery(
  baseOptions: TrelloQueryHookOptions<
    OrganizationContextDataQuery,
    OrganizationContextDataQueryVariables
  > &
    (
      | { variables: OrganizationContextDataQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: OrganizationContextDataDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    OrganizationContextDataQuery,
    OrganizationContextDataQueryVariables
  >(OrganizationContextDataDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useOrganizationContextDataLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    OrganizationContextDataQuery,
    OrganizationContextDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OrganizationContextDataQuery,
    OrganizationContextDataQueryVariables
  >(OrganizationContextDataDocument, options);
}
export function useOrganizationContextDataSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        OrganizationContextDataQuery,
        OrganizationContextDataQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    OrganizationContextDataQuery,
    OrganizationContextDataQueryVariables
  >(OrganizationContextDataDocument, options);
}
export type OrganizationContextDataQueryHookResult = ReturnType<
  typeof useOrganizationContextDataQuery
>;
export type OrganizationContextDataLazyQueryHookResult = ReturnType<
  typeof useOrganizationContextDataLazyQuery
>;
export type OrganizationContextDataSuspenseQueryHookResult = ReturnType<
  typeof useOrganizationContextDataSuspenseQuery
>;
export type OrganizationContextDataQueryResult = Apollo.QueryResult<
  OrganizationContextDataQuery,
  OrganizationContextDataQueryVariables
>;
