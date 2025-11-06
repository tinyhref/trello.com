import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const TenantOrgIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TenantOrgId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cloudIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenantContexts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cloudIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cloudIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgId"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TenantOrgId","document":TenantOrgIdDocument}} as const;
export type TenantOrgIdQueryVariables = Types.Exact<{
  cloudIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type TenantOrgIdQuery = (
  { __typename: 'Query' }
  & { tenantContexts?: Types.Maybe<Array<Types.Maybe<(
    { __typename: 'TenantContext' }
    & Pick<Types.TenantContext, 'orgId'>
  )>>> }
);

/**
 * __useTenantOrgIdQuery__
 *
 * To run a query within a React component, call `useTenantOrgIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTenantOrgIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTenantOrgIdQuery({
 *   variables: {
 *      cloudIds: // value for 'cloudIds'
 *   },
 * });
 */
export function useTenantOrgIdQuery(
  baseOptions: TrelloQueryHookOptions<
    TenantOrgIdQuery,
    TenantOrgIdQueryVariables
  > &
    (
      | { variables: TenantOrgIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: TenantOrgIdDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<TenantOrgIdQuery, TenantOrgIdQueryVariables>(
    TenantOrgIdDocument,
    options,
  );
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useTenantOrgIdLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    TenantOrgIdQuery,
    TenantOrgIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TenantOrgIdQuery, TenantOrgIdQueryVariables>(
    TenantOrgIdDocument,
    options,
  );
}
export function useTenantOrgIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        TenantOrgIdQuery,
        TenantOrgIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<TenantOrgIdQuery, TenantOrgIdQueryVariables>(
    TenantOrgIdDocument,
    options,
  );
}
export type TenantOrgIdQueryHookResult = ReturnType<typeof useTenantOrgIdQuery>;
export type TenantOrgIdLazyQueryHookResult = ReturnType<
  typeof useTenantOrgIdLazyQuery
>;
export type TenantOrgIdSuspenseQueryHookResult = ReturnType<
  typeof useTenantOrgIdSuspenseQuery
>;
export type TenantOrgIdQueryResult = Apollo.QueryResult<
  TenantOrgIdQuery,
  TenantOrgIdQueryVariables
>;
