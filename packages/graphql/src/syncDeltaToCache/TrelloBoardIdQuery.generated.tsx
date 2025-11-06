import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloBoardIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrelloBoardId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloBoard","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloBoardId","document":TrelloBoardIdDocument}} as const;
export type TrelloBoardIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type TrelloBoardIdQuery = (
  { __typename: 'Query' }
  & { trello: (
    { __typename: 'TrelloQueryApi' }
    & { board?: Types.Maybe<(
      { __typename: 'TrelloBoard' }
      & Pick<Types.TrelloBoard, 'id'>
    )> }
  ) }
);

/**
 * __useTrelloBoardIdQuery__
 *
 * To run a query within a React component, call `useTrelloBoardIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrelloBoardIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloBoardIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTrelloBoardIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    TrelloBoardIdQuery,
    TrelloBoardIdQueryVariables
  > &
    (
      | { variables: TrelloBoardIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TrelloBoardIdQuery, TrelloBoardIdQueryVariables>(
    TrelloBoardIdDocument,
    options,
  );
}
export function useTrelloBoardIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TrelloBoardIdQuery,
    TrelloBoardIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TrelloBoardIdQuery, TrelloBoardIdQueryVariables>(
    TrelloBoardIdDocument,
    options,
  );
}
export function useTrelloBoardIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        TrelloBoardIdQuery,
        TrelloBoardIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    TrelloBoardIdQuery,
    TrelloBoardIdQueryVariables
  >(TrelloBoardIdDocument, options);
}
export type TrelloBoardIdQueryHookResult = ReturnType<
  typeof useTrelloBoardIdQuery
>;
export type TrelloBoardIdLazyQueryHookResult = ReturnType<
  typeof useTrelloBoardIdLazyQuery
>;
export type TrelloBoardIdSuspenseQueryHookResult = ReturnType<
  typeof useTrelloBoardIdSuspenseQuery
>;
export type TrelloBoardIdQueryResult = Apollo.QueryResult<
  TrelloBoardIdQuery,
  TrelloBoardIdQueryVariables
>;
