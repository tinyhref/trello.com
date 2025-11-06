import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const FetchInboxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchInbox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inbox"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"FetchInbox","document":FetchInboxDocument}} as const;
export type FetchInboxQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type FetchInboxQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & { inbox: (
      { __typename: 'Inbox' }
      & Pick<Types.Inbox, 'idBoard' | 'idList' | 'idOrganization'>
    ) }
  )> }
);

/**
 * __useFetchInboxQuery__
 *
 * To run a query within a React component, call `useFetchInboxQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchInboxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchInboxQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useFetchInboxQuery(
  baseOptions: TrelloQueryHookOptions<
    FetchInboxQuery,
    FetchInboxQueryVariables
  > &
    (
      | { variables: FetchInboxQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: FetchInboxDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<FetchInboxQuery, FetchInboxQueryVariables>(
    FetchInboxDocument,
    options,
  );
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useFetchInboxLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    FetchInboxQuery,
    FetchInboxQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<FetchInboxQuery, FetchInboxQueryVariables>(
    FetchInboxDocument,
    options,
  );
}
export function useFetchInboxSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<FetchInboxQuery, FetchInboxQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<FetchInboxQuery, FetchInboxQueryVariables>(
    FetchInboxDocument,
    options,
  );
}
export type FetchInboxQueryHookResult = ReturnType<typeof useFetchInboxQuery>;
export type FetchInboxLazyQueryHookResult = ReturnType<
  typeof useFetchInboxLazyQuery
>;
export type FetchInboxSuspenseQueryHookResult = ReturnType<
  typeof useFetchInboxSuspenseQuery
>;
export type FetchInboxQueryResult = Apollo.QueryResult<
  FetchInboxQuery,
  FetchInboxQueryVariables
>;
