import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const MemberQuickBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberQuickBoards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"open"},{"kind":"EnumValue","value":"starred"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"creationMethod"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastView"}},{"kind":"Field","name":{"kind":"Name","value":"datePluginDisable"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBottomColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBrightness"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTopColor"}},{"kind":"Field","name":{"kind":"Name","value":"calendarFeedEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"canInvite"}},{"kind":"Field","name":{"kind":"Name","value":"cardAging"}},{"kind":"Field","name":{"kind":"Name","value":"cardCovers"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"hideVotes"}},{"kind":"Field","name":{"kind":"Name","value":"invitations"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}},{"kind":"Field","name":{"kind":"Name","value":"selfJoin"}},{"kind":"Field","name":{"kind":"Name","value":"voting"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"shortUrl"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardStars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MemberQuickBoards","document":MemberQuickBoardsDocument}} as const;
export type MemberQuickBoardsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MemberQuickBoardsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & {
      boards: Array<(
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
      )>,
      boardStars: Array<(
        { __typename: 'BoardStar' }
        & Pick<Types.BoardStar, 'id' | 'idBoard' | 'pos'>
      )>,
    }
  )> }
);

/**
 * __useMemberQuickBoardsQuery__
 *
 * To run a query within a React component, call `useMemberQuickBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberQuickBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberQuickBoardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMemberQuickBoardsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    MemberQuickBoardsQuery,
    MemberQuickBoardsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    MemberQuickBoardsQuery,
    MemberQuickBoardsQueryVariables
  >(MemberQuickBoardsDocument, options);
}
export function useMemberQuickBoardsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MemberQuickBoardsQuery,
    MemberQuickBoardsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MemberQuickBoardsQuery,
    MemberQuickBoardsQueryVariables
  >(MemberQuickBoardsDocument, options);
}
export function useMemberQuickBoardsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        MemberQuickBoardsQuery,
        MemberQuickBoardsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    MemberQuickBoardsQuery,
    MemberQuickBoardsQueryVariables
  >(MemberQuickBoardsDocument, options);
}
export type MemberQuickBoardsQueryHookResult = ReturnType<
  typeof useMemberQuickBoardsQuery
>;
export type MemberQuickBoardsLazyQueryHookResult = ReturnType<
  typeof useMemberQuickBoardsLazyQuery
>;
export type MemberQuickBoardsSuspenseQueryHookResult = ReturnType<
  typeof useMemberQuickBoardsSuspenseQuery
>;
export type MemberQuickBoardsQueryResult = Apollo.QueryResult<
  MemberQuickBoardsQuery,
  MemberQuickBoardsQueryVariables
>;
