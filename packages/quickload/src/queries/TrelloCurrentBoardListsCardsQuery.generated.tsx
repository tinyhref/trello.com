import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloCurrentBoardListsCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrelloCurrentBoardListsCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloShortLink"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"boardByShortLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shortLink"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloBoard","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloListCards","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloCurrentBoardListsCards","document":TrelloCurrentBoardListsCardsDocument}} as const;
export type TrelloCurrentBoardListsCardsQueryVariables = Types.Exact<{
  id: Types.Scalars['TrelloShortLink']['input'];
}>;


export type TrelloCurrentBoardListsCardsQuery = (
  { __typename: 'Query' }
  & { trello: (
    { __typename: 'TrelloQueryApi' }
    & { boardByShortLink?: Types.Maybe<(
      { __typename: 'TrelloBoard' }
      & Pick<Types.TrelloBoard, 'id'>
      & { lists?: Types.Maybe<(
        { __typename: 'TrelloListConnection' }
        & { edges?: Types.Maybe<Array<(
          { __typename: 'TrelloListEdge' }
          & { node?: Types.Maybe<(
            { __typename: 'TrelloList' }
            & Pick<Types.TrelloList, 'id'>
            & { cards?: Types.Maybe<(
              { __typename: 'TrelloCardConnection' }
              & { edges?: Types.Maybe<Array<(
                { __typename: 'TrelloCardEdge' }
                & { node?: Types.Maybe<
                  | (
                    { __typename: 'TrelloCard' }
                    & Pick<Types.TrelloCard, 'id'>
                    & { labels?: Types.Maybe<(
                      { __typename: 'TrelloLabelConnection' }
                      & { edges?: Types.Maybe<Array<(
                        { __typename: 'TrelloLabelEdge' }
                        & { node: (
                          { __typename: 'TrelloLabel' }
                          & Pick<
                            Types.TrelloLabel,
                            | 'id'
                            | 'color'
                            | 'name'
                            | 'objectId'
                          >
                        ) }
                      )>> }
                    )> }
                  )
                  | (
                    { __typename: 'TrelloInboxCard' }
                    & Pick<Types.TrelloInboxCard, 'id'>
                  )
                > }
              )>> }
            )> }
          )> }
        )>> }
      )> }
    )> }
  ) }
);

/**
 * __useTrelloCurrentBoardListsCardsQuery__
 *
 * To run a query within a React component, call `useTrelloCurrentBoardListsCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrelloCurrentBoardListsCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloCurrentBoardListsCardsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTrelloCurrentBoardListsCardsQuery(
  baseOptions: Apollo.QueryHookOptions<
    TrelloCurrentBoardListsCardsQuery,
    TrelloCurrentBoardListsCardsQueryVariables
  > &
    (
      | {
          variables: TrelloCurrentBoardListsCardsQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    TrelloCurrentBoardListsCardsQuery,
    TrelloCurrentBoardListsCardsQueryVariables
  >(TrelloCurrentBoardListsCardsDocument, options);
}
export function useTrelloCurrentBoardListsCardsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TrelloCurrentBoardListsCardsQuery,
    TrelloCurrentBoardListsCardsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    TrelloCurrentBoardListsCardsQuery,
    TrelloCurrentBoardListsCardsQueryVariables
  >(TrelloCurrentBoardListsCardsDocument, options);
}
export function useTrelloCurrentBoardListsCardsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        TrelloCurrentBoardListsCardsQuery,
        TrelloCurrentBoardListsCardsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    TrelloCurrentBoardListsCardsQuery,
    TrelloCurrentBoardListsCardsQueryVariables
  >(TrelloCurrentBoardListsCardsDocument, options);
}
export type TrelloCurrentBoardListsCardsQueryHookResult = ReturnType<
  typeof useTrelloCurrentBoardListsCardsQuery
>;
export type TrelloCurrentBoardListsCardsLazyQueryHookResult = ReturnType<
  typeof useTrelloCurrentBoardListsCardsLazyQuery
>;
export type TrelloCurrentBoardListsCardsSuspenseQueryHookResult = ReturnType<
  typeof useTrelloCurrentBoardListsCardsSuspenseQuery
>;
export type TrelloCurrentBoardListsCardsQueryResult = Apollo.QueryResult<
  TrelloCurrentBoardListsCardsQuery,
  TrelloCurrentBoardListsCardsQueryVariables
>;
