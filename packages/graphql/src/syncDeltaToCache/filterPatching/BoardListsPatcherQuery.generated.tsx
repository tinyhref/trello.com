import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const BoardListsPatcherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardListsPatcher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"lists"},"name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"listsClosed"},"name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"closed"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"listsOpen"},"name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardListsPatcher","document":BoardListsPatcherDocument}} as const;
export type BoardListsPatcherQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID']['input'];
}>;


export type BoardListsPatcherQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & {
      lists: Array<(
        { __typename: 'List' }
        & Pick<Types.List, 'id'>
      )>,
      listsClosed: Array<(
        { __typename: 'List' }
        & Pick<Types.List, 'id'>
      )>,
      listsOpen: Array<(
        { __typename: 'List' }
        & Pick<Types.List, 'id'>
      )>,
    }
  )> }
);

/**
 * __useBoardListsPatcherQuery__
 *
 * To run a query within a React component, call `useBoardListsPatcherQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardListsPatcherQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardListsPatcherQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useBoardListsPatcherQuery(
  baseOptions: Apollo.QueryHookOptions<
    BoardListsPatcherQuery,
    BoardListsPatcherQueryVariables
  > &
    (
      | { variables: BoardListsPatcherQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    BoardListsPatcherQuery,
    BoardListsPatcherQueryVariables
  >(BoardListsPatcherDocument, options);
}
export function useBoardListsPatcherLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    BoardListsPatcherQuery,
    BoardListsPatcherQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardListsPatcherQuery,
    BoardListsPatcherQueryVariables
  >(BoardListsPatcherDocument, options);
}
export function useBoardListsPatcherSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        BoardListsPatcherQuery,
        BoardListsPatcherQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardListsPatcherQuery,
    BoardListsPatcherQueryVariables
  >(BoardListsPatcherDocument, options);
}
export type BoardListsPatcherQueryHookResult = ReturnType<
  typeof useBoardListsPatcherQuery
>;
export type BoardListsPatcherLazyQueryHookResult = ReturnType<
  typeof useBoardListsPatcherLazyQuery
>;
export type BoardListsPatcherSuspenseQueryHookResult = ReturnType<
  typeof useBoardListsPatcherSuspenseQuery
>;
export type BoardListsPatcherQueryResult = Apollo.QueryResult<
  BoardListsPatcherQuery,
  BoardListsPatcherQueryVariables
>;
