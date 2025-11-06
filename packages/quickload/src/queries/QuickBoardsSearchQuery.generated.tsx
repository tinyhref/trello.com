import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const QuickBoardsSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"QuickBoardsSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"partial"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"creationMethod"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastView"}},{"kind":"Field","name":{"kind":"Name","value":"datePluginDisable"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBottomColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBrightness"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTopColor"}},{"kind":"Field","name":{"kind":"Name","value":"calendarFeedEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"canInvite"}},{"kind":"Field","name":{"kind":"Name","value":"cardAging"}},{"kind":"Field","name":{"kind":"Name","value":"cardCovers"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"hideVotes"}},{"kind":"Field","name":{"kind":"Name","value":"invitations"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}},{"kind":"Field","name":{"kind":"Name","value":"selfJoin"}},{"kind":"Field","name":{"kind":"Name","value":"voting"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"shortUrl"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"QuickBoardsSearch","document":QuickBoardsSearchDocument}} as const;
export type QuickBoardsSearchQueryVariables = Types.Exact<{
  query: Types.Scalars['String']['input'];
}>;


export type QuickBoardsSearchQuery = (
  { __typename: 'Query' }
  & { search: (
    { __typename: 'Search' }
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<
        Types.Board,
        | 'id'
        | 'closed'
        | 'creationMethod'
        | 'dateLastActivity'
        | 'dateLastView'
        | 'datePluginDisable'
        | 'enterpriseOwned'
        | 'idEnterprise'
        | 'idOrganization'
        | 'name'
        | 'premiumFeatures'
        | 'shortLink'
        | 'shortUrl'
        | 'url'
      >
      & { prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<
          Types.Board_Prefs,
          | 'background'
          | 'backgroundBottomColor'
          | 'backgroundBrightness'
          | 'backgroundColor'
          | 'backgroundImage'
          | 'backgroundTile'
          | 'backgroundTopColor'
          | 'calendarFeedEnabled'
          | 'canInvite'
          | 'cardAging'
          | 'cardCovers'
          | 'comments'
          | 'hideVotes'
          | 'invitations'
          | 'isTemplate'
          | 'permissionLevel'
          | 'selfJoin'
          | 'voting'
        >
        & { backgroundImageScaled?: Types.Maybe<Array<(
          { __typename: 'Board_Prefs_BackgroundImageScaled' }
          & Pick<Types.Board_Prefs_BackgroundImageScaled, 'height' | 'url' | 'width'>
        )>> }
      )> }
    )> }
  ) }
);

/**
 * __useQuickBoardsSearchQuery__
 *
 * To run a query within a React component, call `useQuickBoardsSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuickBoardsSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuickBoardsSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useQuickBoardsSearchQuery(
  baseOptions: Apollo.QueryHookOptions<
    QuickBoardsSearchQuery,
    QuickBoardsSearchQueryVariables
  > &
    (
      | { variables: QuickBoardsSearchQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    QuickBoardsSearchQuery,
    QuickBoardsSearchQueryVariables
  >(QuickBoardsSearchDocument, options);
}
export function useQuickBoardsSearchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    QuickBoardsSearchQuery,
    QuickBoardsSearchQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    QuickBoardsSearchQuery,
    QuickBoardsSearchQueryVariables
  >(QuickBoardsSearchDocument, options);
}
export function useQuickBoardsSearchSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        QuickBoardsSearchQuery,
        QuickBoardsSearchQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    QuickBoardsSearchQuery,
    QuickBoardsSearchQueryVariables
  >(QuickBoardsSearchDocument, options);
}
export type QuickBoardsSearchQueryHookResult = ReturnType<
  typeof useQuickBoardsSearchQuery
>;
export type QuickBoardsSearchLazyQueryHookResult = ReturnType<
  typeof useQuickBoardsSearchLazyQuery
>;
export type QuickBoardsSearchSuspenseQueryHookResult = ReturnType<
  typeof useQuickBoardsSearchSuspenseQuery
>;
export type QuickBoardsSearchQueryResult = Apollo.QueryResult<
  QuickBoardsSearchQuery,
  QuickBoardsSearchQueryVariables
>;
