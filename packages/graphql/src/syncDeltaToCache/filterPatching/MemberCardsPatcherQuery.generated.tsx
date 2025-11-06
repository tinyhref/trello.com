import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const MemberCardsPatcherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberCardsPatcher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"cardsClosed"},"name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"closed"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"cardsOpen"},"name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"cardsVisible"},"name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MemberCardsPatcher","document":MemberCardsPatcherDocument}} as const;
export type MemberCardsPatcherQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID']['input'];
}>;


export type MemberCardsPatcherQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & {
      cards: Array<(
        { __typename: 'Card' }
        & Pick<Types.Card, 'id'>
      )>,
      cardsClosed: Array<(
        { __typename: 'Card' }
        & Pick<Types.Card, 'id'>
      )>,
      cardsOpen: Array<(
        { __typename: 'Card' }
        & Pick<Types.Card, 'id'>
      )>,
      cardsVisible: Array<(
        { __typename: 'Card' }
        & Pick<Types.Card, 'id'>
      )>,
    }
  )> }
);

/**
 * __useMemberCardsPatcherQuery__
 *
 * To run a query within a React component, call `useMemberCardsPatcherQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberCardsPatcherQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberCardsPatcherQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useMemberCardsPatcherQuery(
  baseOptions: Apollo.QueryHookOptions<
    MemberCardsPatcherQuery,
    MemberCardsPatcherQueryVariables
  > &
    (
      | { variables: MemberCardsPatcherQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    MemberCardsPatcherQuery,
    MemberCardsPatcherQueryVariables
  >(MemberCardsPatcherDocument, options);
}
export function useMemberCardsPatcherLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MemberCardsPatcherQuery,
    MemberCardsPatcherQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MemberCardsPatcherQuery,
    MemberCardsPatcherQueryVariables
  >(MemberCardsPatcherDocument, options);
}
export function useMemberCardsPatcherSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        MemberCardsPatcherQuery,
        MemberCardsPatcherQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    MemberCardsPatcherQuery,
    MemberCardsPatcherQueryVariables
  >(MemberCardsPatcherDocument, options);
}
export type MemberCardsPatcherQueryHookResult = ReturnType<
  typeof useMemberCardsPatcherQuery
>;
export type MemberCardsPatcherLazyQueryHookResult = ReturnType<
  typeof useMemberCardsPatcherLazyQuery
>;
export type MemberCardsPatcherSuspenseQueryHookResult = ReturnType<
  typeof useMemberCardsPatcherSuspenseQuery
>;
export type MemberCardsPatcherQueryResult = Apollo.QueryResult<
  MemberCardsPatcherQuery,
  MemberCardsPatcherQueryVariables
>;
