import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const BoardLabelsPatcherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardLabelsPatcher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"labelsAll"},"name":{"kind":"Name","value":"labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"all"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardLabelsPatcher","document":BoardLabelsPatcherDocument}} as const;
export type BoardLabelsPatcherQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID']['input'];
}>;


export type BoardLabelsPatcherQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & {
      labels: Array<(
        { __typename: 'Label' }
        & Pick<Types.Label, 'id'>
      )>,
      labelsAll: Array<(
        { __typename: 'Label' }
        & Pick<Types.Label, 'id'>
      )>,
    }
  )> }
);

/**
 * __useBoardLabelsPatcherQuery__
 *
 * To run a query within a React component, call `useBoardLabelsPatcherQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardLabelsPatcherQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardLabelsPatcherQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useBoardLabelsPatcherQuery(
  baseOptions: Apollo.QueryHookOptions<
    BoardLabelsPatcherQuery,
    BoardLabelsPatcherQueryVariables
  > &
    (
      | { variables: BoardLabelsPatcherQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    BoardLabelsPatcherQuery,
    BoardLabelsPatcherQueryVariables
  >(BoardLabelsPatcherDocument, options);
}
export function useBoardLabelsPatcherLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    BoardLabelsPatcherQuery,
    BoardLabelsPatcherQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardLabelsPatcherQuery,
    BoardLabelsPatcherQueryVariables
  >(BoardLabelsPatcherDocument, options);
}
export function useBoardLabelsPatcherSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        BoardLabelsPatcherQuery,
        BoardLabelsPatcherQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardLabelsPatcherQuery,
    BoardLabelsPatcherQueryVariables
  >(BoardLabelsPatcherDocument, options);
}
export type BoardLabelsPatcherQueryHookResult = ReturnType<
  typeof useBoardLabelsPatcherQuery
>;
export type BoardLabelsPatcherLazyQueryHookResult = ReturnType<
  typeof useBoardLabelsPatcherLazyQuery
>;
export type BoardLabelsPatcherSuspenseQueryHookResult = ReturnType<
  typeof useBoardLabelsPatcherSuspenseQuery
>;
export type BoardLabelsPatcherQueryResult = Apollo.QueryResult<
  BoardLabelsPatcherQuery,
  BoardLabelsPatcherQueryVariables
>;
