import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const BoardCardsPatcherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardCardsPatcher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"cards"},"name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"cardsClosed"},"name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"closed"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"cardsOpen"},"name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"cardsVisible"},"name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardCardsPatcher","document":BoardCardsPatcherDocument}} as const;
export type BoardCardsPatcherQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID']['input'];
}>;


export type BoardCardsPatcherQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
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
 * __useBoardCardsPatcherQuery__
 *
 * To run a query within a React component, call `useBoardCardsPatcherQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardCardsPatcherQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardCardsPatcherQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useBoardCardsPatcherQuery(
  baseOptions: Apollo.QueryHookOptions<
    BoardCardsPatcherQuery,
    BoardCardsPatcherQueryVariables
  > &
    (
      | { variables: BoardCardsPatcherQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    BoardCardsPatcherQuery,
    BoardCardsPatcherQueryVariables
  >(BoardCardsPatcherDocument, options);
}
export function useBoardCardsPatcherLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    BoardCardsPatcherQuery,
    BoardCardsPatcherQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardCardsPatcherQuery,
    BoardCardsPatcherQueryVariables
  >(BoardCardsPatcherDocument, options);
}
export function useBoardCardsPatcherSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        BoardCardsPatcherQuery,
        BoardCardsPatcherQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardCardsPatcherQuery,
    BoardCardsPatcherQueryVariables
  >(BoardCardsPatcherDocument, options);
}
export type BoardCardsPatcherQueryHookResult = ReturnType<
  typeof useBoardCardsPatcherQuery
>;
export type BoardCardsPatcherLazyQueryHookResult = ReturnType<
  typeof useBoardCardsPatcherLazyQuery
>;
export type BoardCardsPatcherSuspenseQueryHookResult = ReturnType<
  typeof useBoardCardsPatcherSuspenseQuery
>;
export type BoardCardsPatcherQueryResult = Apollo.QueryResult<
  BoardCardsPatcherQuery,
  BoardCardsPatcherQueryVariables
>;
