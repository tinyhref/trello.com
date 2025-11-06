import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const MemberVisibleCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberVisibleCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MemberVisibleCards","document":MemberVisibleCardsDocument}} as const;
export type MemberVisibleCardsQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID']['input'];
}>;


export type MemberVisibleCardsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & { cards: Array<(
      { __typename: 'Card' }
      & Pick<Types.Card, 'id'>
    )> }
  )> }
);

/**
 * __useMemberVisibleCardsQuery__
 *
 * To run a query within a React component, call `useMemberVisibleCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberVisibleCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberVisibleCardsQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useMemberVisibleCardsQuery(
  baseOptions: Apollo.QueryHookOptions<
    MemberVisibleCardsQuery,
    MemberVisibleCardsQueryVariables
  > &
    (
      | { variables: MemberVisibleCardsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    MemberVisibleCardsQuery,
    MemberVisibleCardsQueryVariables
  >(MemberVisibleCardsDocument, options);
}
export function useMemberVisibleCardsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MemberVisibleCardsQuery,
    MemberVisibleCardsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MemberVisibleCardsQuery,
    MemberVisibleCardsQueryVariables
  >(MemberVisibleCardsDocument, options);
}
export function useMemberVisibleCardsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        MemberVisibleCardsQuery,
        MemberVisibleCardsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    MemberVisibleCardsQuery,
    MemberVisibleCardsQueryVariables
  >(MemberVisibleCardsDocument, options);
}
export type MemberVisibleCardsQueryHookResult = ReturnType<
  typeof useMemberVisibleCardsQuery
>;
export type MemberVisibleCardsLazyQueryHookResult = ReturnType<
  typeof useMemberVisibleCardsLazyQuery
>;
export type MemberVisibleCardsSuspenseQueryHookResult = ReturnType<
  typeof useMemberVisibleCardsSuspenseQuery
>;
export type MemberVisibleCardsQueryResult = Apollo.QueryResult<
  MemberVisibleCardsQuery,
  MemberVisibleCardsQueryVariables
>;
