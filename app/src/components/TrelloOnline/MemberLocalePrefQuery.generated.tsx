import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const MemberLocalePrefDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberLocalePref"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MemberLocalePref","document":MemberLocalePrefDocument}} as const;
export type MemberLocalePrefQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type MemberLocalePrefQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & { prefs?: Types.Maybe<(
      { __typename: 'Member_Prefs' }
      & Pick<Types.Member_Prefs, 'locale'>
    )> }
  )> }
);

/**
 * __useMemberLocalePrefQuery__
 *
 * To run a query within a React component, call `useMemberLocalePrefQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberLocalePrefQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberLocalePrefQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useMemberLocalePrefQuery(
  baseOptions: TrelloQueryHookOptions<
    MemberLocalePrefQuery,
    MemberLocalePrefQueryVariables
  > &
    (
      | { variables: MemberLocalePrefQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: MemberLocalePrefDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    MemberLocalePrefQuery,
    MemberLocalePrefQueryVariables
  >(MemberLocalePrefDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useMemberLocalePrefLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    MemberLocalePrefQuery,
    MemberLocalePrefQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MemberLocalePrefQuery,
    MemberLocalePrefQueryVariables
  >(MemberLocalePrefDocument, options);
}
export function useMemberLocalePrefSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        MemberLocalePrefQuery,
        MemberLocalePrefQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    MemberLocalePrefQuery,
    MemberLocalePrefQueryVariables
  >(MemberLocalePrefDocument, options);
}
export type MemberLocalePrefQueryHookResult = ReturnType<
  typeof useMemberLocalePrefQuery
>;
export type MemberLocalePrefLazyQueryHookResult = ReturnType<
  typeof useMemberLocalePrefLazyQuery
>;
export type MemberLocalePrefSuspenseQueryHookResult = ReturnType<
  typeof useMemberLocalePrefSuspenseQuery
>;
export type MemberLocalePrefQueryResult = Apollo.QueryResult<
  MemberLocalePrefQuery,
  MemberLocalePrefQueryVariables
>;
