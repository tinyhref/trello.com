import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloWorkspaceIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrelloWorkspaceId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloWorkspace","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloWorkspaceId","document":TrelloWorkspaceIdDocument}} as const;
export type TrelloWorkspaceIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type TrelloWorkspaceIdQuery = (
  { __typename: 'Query' }
  & { trello: (
    { __typename: 'TrelloQueryApi' }
    & { workspace?: Types.Maybe<(
      { __typename: 'TrelloWorkspace' }
      & Pick<Types.TrelloWorkspace, 'id'>
    )> }
  ) }
);

/**
 * __useTrelloWorkspaceIdQuery__
 *
 * To run a query within a React component, call `useTrelloWorkspaceIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrelloWorkspaceIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloWorkspaceIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTrelloWorkspaceIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    TrelloWorkspaceIdQuery,
    TrelloWorkspaceIdQueryVariables
  > &
    (
      | { variables: TrelloWorkspaceIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    TrelloWorkspaceIdQuery,
    TrelloWorkspaceIdQueryVariables
  >(TrelloWorkspaceIdDocument, options);
}
export function useTrelloWorkspaceIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TrelloWorkspaceIdQuery,
    TrelloWorkspaceIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    TrelloWorkspaceIdQuery,
    TrelloWorkspaceIdQueryVariables
  >(TrelloWorkspaceIdDocument, options);
}
export function useTrelloWorkspaceIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        TrelloWorkspaceIdQuery,
        TrelloWorkspaceIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    TrelloWorkspaceIdQuery,
    TrelloWorkspaceIdQueryVariables
  >(TrelloWorkspaceIdDocument, options);
}
export type TrelloWorkspaceIdQueryHookResult = ReturnType<
  typeof useTrelloWorkspaceIdQuery
>;
export type TrelloWorkspaceIdLazyQueryHookResult = ReturnType<
  typeof useTrelloWorkspaceIdLazyQuery
>;
export type TrelloWorkspaceIdSuspenseQueryHookResult = ReturnType<
  typeof useTrelloWorkspaceIdSuspenseQuery
>;
export type TrelloWorkspaceIdQueryResult = Apollo.QueryResult<
  TrelloWorkspaceIdQuery,
  TrelloWorkspaceIdQueryVariables
>;
