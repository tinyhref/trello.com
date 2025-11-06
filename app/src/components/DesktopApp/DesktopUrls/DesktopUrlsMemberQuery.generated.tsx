import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const DesktopUrlsMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DesktopUrlsMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"DesktopUrlsMember","document":DesktopUrlsMemberDocument}} as const;
export type DesktopUrlsMemberQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type DesktopUrlsMemberQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'username'>
  )> }
);

/**
 * __useDesktopUrlsMemberQuery__
 *
 * To run a query within a React component, call `useDesktopUrlsMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useDesktopUrlsMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDesktopUrlsMemberQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useDesktopUrlsMemberQuery(
  baseOptions: TrelloQueryHookOptions<
    DesktopUrlsMemberQuery,
    DesktopUrlsMemberQueryVariables
  > &
    (
      | { variables: DesktopUrlsMemberQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: DesktopUrlsMemberDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    DesktopUrlsMemberQuery,
    DesktopUrlsMemberQueryVariables
  >(DesktopUrlsMemberDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useDesktopUrlsMemberLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    DesktopUrlsMemberQuery,
    DesktopUrlsMemberQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DesktopUrlsMemberQuery,
    DesktopUrlsMemberQueryVariables
  >(DesktopUrlsMemberDocument, options);
}
export function useDesktopUrlsMemberSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        DesktopUrlsMemberQuery,
        DesktopUrlsMemberQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    DesktopUrlsMemberQuery,
    DesktopUrlsMemberQueryVariables
  >(DesktopUrlsMemberDocument, options);
}
export type DesktopUrlsMemberQueryHookResult = ReturnType<
  typeof useDesktopUrlsMemberQuery
>;
export type DesktopUrlsMemberLazyQueryHookResult = ReturnType<
  typeof useDesktopUrlsMemberLazyQuery
>;
export type DesktopUrlsMemberSuspenseQueryHookResult = ReturnType<
  typeof useDesktopUrlsMemberSuspenseQuery
>;
export type DesktopUrlsMemberQueryResult = Apollo.QueryResult<
  DesktopUrlsMemberQuery,
  DesktopUrlsMemberQueryVariables
>;
