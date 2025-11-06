import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const MemberBoardsPatcherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberBoardsPatcher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"boardsClosed"},"name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"closed"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"boardsOpen"},"name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"boardsOpenStarred"},"name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"open"},{"kind":"EnumValue","value":"starred"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"boardsStarred"},"name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"starred"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MemberBoardsPatcher","document":MemberBoardsPatcherDocument}} as const;
export type MemberBoardsPatcherQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID']['input'];
}>;


export type MemberBoardsPatcherQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & {
      boards: Array<(
        { __typename: 'Board' }
        & Pick<Types.Board, 'id'>
      )>,
      boardsClosed: Array<(
        { __typename: 'Board' }
        & Pick<Types.Board, 'id'>
      )>,
      boardsOpen: Array<(
        { __typename: 'Board' }
        & Pick<Types.Board, 'id'>
      )>,
      boardsOpenStarred: Array<(
        { __typename: 'Board' }
        & Pick<Types.Board, 'id'>
      )>,
      boardsStarred: Array<(
        { __typename: 'Board' }
        & Pick<Types.Board, 'id'>
      )>,
    }
  )> }
);

/**
 * __useMemberBoardsPatcherQuery__
 *
 * To run a query within a React component, call `useMemberBoardsPatcherQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberBoardsPatcherQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberBoardsPatcherQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useMemberBoardsPatcherQuery(
  baseOptions: Apollo.QueryHookOptions<
    MemberBoardsPatcherQuery,
    MemberBoardsPatcherQueryVariables
  > &
    (
      | { variables: MemberBoardsPatcherQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    MemberBoardsPatcherQuery,
    MemberBoardsPatcherQueryVariables
  >(MemberBoardsPatcherDocument, options);
}
export function useMemberBoardsPatcherLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MemberBoardsPatcherQuery,
    MemberBoardsPatcherQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MemberBoardsPatcherQuery,
    MemberBoardsPatcherQueryVariables
  >(MemberBoardsPatcherDocument, options);
}
export function useMemberBoardsPatcherSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        MemberBoardsPatcherQuery,
        MemberBoardsPatcherQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    MemberBoardsPatcherQuery,
    MemberBoardsPatcherQueryVariables
  >(MemberBoardsPatcherDocument, options);
}
export type MemberBoardsPatcherQueryHookResult = ReturnType<
  typeof useMemberBoardsPatcherQuery
>;
export type MemberBoardsPatcherLazyQueryHookResult = ReturnType<
  typeof useMemberBoardsPatcherLazyQuery
>;
export type MemberBoardsPatcherSuspenseQueryHookResult = ReturnType<
  typeof useMemberBoardsPatcherSuspenseQuery
>;
export type MemberBoardsPatcherQueryResult = Apollo.QueryResult<
  MemberBoardsPatcherQuery,
  MemberBoardsPatcherQueryVariables
>;
