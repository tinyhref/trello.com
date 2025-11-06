import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloMemberIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrelloMemberId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloMember","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloMemberId","document":TrelloMemberIdDocument}} as const;
export type TrelloMemberIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type TrelloMemberIdQuery = (
  { __typename: 'Query' }
  & { trello: (
    { __typename: 'TrelloQueryApi' }
    & { member?: Types.Maybe<(
      { __typename: 'TrelloMember' }
      & Pick<Types.TrelloMember, 'id'>
    )> }
  ) }
);

/**
 * __useTrelloMemberIdQuery__
 *
 * To run a query within a React component, call `useTrelloMemberIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrelloMemberIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloMemberIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTrelloMemberIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    TrelloMemberIdQuery,
    TrelloMemberIdQueryVariables
  > &
    (
      | { variables: TrelloMemberIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TrelloMemberIdQuery, TrelloMemberIdQueryVariables>(
    TrelloMemberIdDocument,
    options,
  );
}
export function useTrelloMemberIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TrelloMemberIdQuery,
    TrelloMemberIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TrelloMemberIdQuery, TrelloMemberIdQueryVariables>(
    TrelloMemberIdDocument,
    options,
  );
}
export function useTrelloMemberIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        TrelloMemberIdQuery,
        TrelloMemberIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    TrelloMemberIdQuery,
    TrelloMemberIdQueryVariables
  >(TrelloMemberIdDocument, options);
}
export type TrelloMemberIdQueryHookResult = ReturnType<
  typeof useTrelloMemberIdQuery
>;
export type TrelloMemberIdLazyQueryHookResult = ReturnType<
  typeof useTrelloMemberIdLazyQuery
>;
export type TrelloMemberIdSuspenseQueryHookResult = ReturnType<
  typeof useTrelloMemberIdSuspenseQuery
>;
export type TrelloMemberIdQueryResult = Apollo.QueryResult<
  TrelloMemberIdQuery,
  TrelloMemberIdQueryVariables
>;
