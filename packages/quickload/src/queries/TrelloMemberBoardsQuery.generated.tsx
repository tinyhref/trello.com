import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloMemberBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrelloMemberBoards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloMe","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"boardStars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"boardObjectId"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloMemberBoards","document":TrelloMemberBoardsDocument}} as const;
export type TrelloMemberBoardsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TrelloMemberBoardsQuery = (
  { __typename: 'Query' }
  & { trello: (
    { __typename: 'TrelloQueryApi' }
    & { me?: Types.Maybe<(
      { __typename: 'TrelloMember' }
      & Pick<Types.TrelloMember, 'id'>
      & { boardStars?: Types.Maybe<(
        { __typename: 'TrelloMemberBoardStarConnection' }
        & { edges?: Types.Maybe<Array<(
          { __typename: 'TrelloMemberBoardStarEdge' }
          & Pick<
            Types.TrelloMemberBoardStarEdge,
            | 'id'
            | 'boardObjectId'
            | 'objectId'
            | 'position'
          >
        )>> }
      )> }
    )> }
  ) }
);

/**
 * __useTrelloMemberBoardsQuery__
 *
 * To run a query within a React component, call `useTrelloMemberBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrelloMemberBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloMemberBoardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTrelloMemberBoardsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    TrelloMemberBoardsQuery,
    TrelloMemberBoardsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    TrelloMemberBoardsQuery,
    TrelloMemberBoardsQueryVariables
  >(TrelloMemberBoardsDocument, options);
}
export function useTrelloMemberBoardsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TrelloMemberBoardsQuery,
    TrelloMemberBoardsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    TrelloMemberBoardsQuery,
    TrelloMemberBoardsQueryVariables
  >(TrelloMemberBoardsDocument, options);
}
export function useTrelloMemberBoardsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        TrelloMemberBoardsQuery,
        TrelloMemberBoardsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    TrelloMemberBoardsQuery,
    TrelloMemberBoardsQueryVariables
  >(TrelloMemberBoardsDocument, options);
}
export type TrelloMemberBoardsQueryHookResult = ReturnType<
  typeof useTrelloMemberBoardsQuery
>;
export type TrelloMemberBoardsLazyQueryHookResult = ReturnType<
  typeof useTrelloMemberBoardsLazyQuery
>;
export type TrelloMemberBoardsSuspenseQueryHookResult = ReturnType<
  typeof useTrelloMemberBoardsSuspenseQuery
>;
export type TrelloMemberBoardsQueryResult = Apollo.QueryResult<
  TrelloMemberBoardsQuery,
  TrelloMemberBoardsQueryVariables
>;
