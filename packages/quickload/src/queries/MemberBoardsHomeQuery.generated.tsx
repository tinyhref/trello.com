import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const MemberBoardsHomeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberBoardsHome"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"open"},{"kind":"EnumValue","value":"starred"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"creationMethod"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastView"}},{"kind":"Field","name":{"kind":"Name","value":"datePluginDisable"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"me"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"orgMemberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nodeId"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"applied"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"countType"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberInvited"}},{"kind":"Field","name":{"kind":"Name","value":"idModel"}},{"kind":"Field","name":{"kind":"Name","value":"modelType"}},{"kind":"Field","name":{"kind":"Name","value":"reward"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"via"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeBoardsPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalMembersPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usersPerFreeOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associatedDomain"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentRestrictions"}},{"kind":"Field","name":{"kind":"Name","value":"boardDeleteRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"boardVisibilityRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"externalMembersDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"orgInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"products"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBottomColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBrightness"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundDarkImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTopColor"}},{"kind":"Field","name":{"kind":"Name","value":"calendarFeedEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"canInvite"}},{"kind":"Field","name":{"kind":"Name","value":"cardAging"}},{"kind":"Field","name":{"kind":"Name","value":"cardCovers"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"hideVotes"}},{"kind":"Field","name":{"kind":"Name","value":"invitations"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}},{"kind":"Field","name":{"kind":"Name","value":"selfJoin"}},{"kind":"Field","name":{"kind":"Name","value":"voting"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"shortUrl"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardStars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"applied"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"countType"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberInvited"}},{"kind":"Field","name":{"kind":"Name","value":"idModel"}},{"kind":"Field","name":{"kind":"Name","value":"modelType"}},{"kind":"Field","name":{"kind":"Name","value":"reward"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"via"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeBoardsPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalMembersPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usersPerFreeOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associatedDomain"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentRestrictions"}},{"kind":"Field","name":{"kind":"Name","value":"boardDeleteRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"boardVisibilityRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"externalMembersDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"orgInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MemberBoardsHome","document":MemberBoardsHomeDocument}} as const;
export type MemberBoardsHomeQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MemberBoardsHomeQuery = (
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
          | 'nodeId'
          | 'premiumFeatures'
          | 'shortLink'
          | 'shortUrl'
          | 'subscribed'
          | 'url'
        >
        & {
          memberships: Array<(
            { __typename: 'Board_Membership' }
            & Pick<
              Types.Board_Membership,
              | 'id'
              | 'deactivated'
              | 'idMember'
              | 'memberType'
              | 'orgMemberType'
              | 'unconfirmed'
            >
          )>,
          organization?: Types.Maybe<(
            { __typename: 'Organization' }
            & Pick<
              Types.Organization,
              | 'id'
              | 'displayName'
              | 'idEnterprise'
              | 'logoHash'
              | 'name'
              | 'offering'
              | 'premiumFeatures'
              | 'products'
            >
            & {
              credits: Array<(
                { __typename: 'Credit' }
                & Pick<
                  Types.Credit,
                  | 'id'
                  | 'applied'
                  | 'count'
                  | 'countType'
                  | 'idMemberInvited'
                  | 'idModel'
                  | 'modelType'
                  | 'reward'
                  | 'type'
                  | 'via'
                >
              )>,
              limits: (
                { __typename: 'Organization_Limits' }
                & { orgs: (
                  { __typename: 'Organization_Limits_Orgs' }
                  & {
                    freeBoardsPerOrg: (
                      { __typename: 'Limit' }
                      & Pick<
                        Types.Limit,
                        | 'count'
                        | 'disableAt'
                        | 'status'
                        | 'warnAt'
                      >
                    ),
                    totalMembersPerOrg: (
                      { __typename: 'Limit' }
                      & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
                    ),
                    usersPerFreeOrg: (
                      { __typename: 'Limit' }
                      & Pick<
                        Types.Limit,
                        | 'count'
                        | 'disableAt'
                        | 'status'
                        | 'warnAt'
                      >
                    ),
                  }
                ) }
              ),
              prefs: (
                { __typename: 'Organization_Prefs' }
                & Pick<
                  Types.Organization_Prefs,
                  | 'associatedDomain'
                  | 'attachmentRestrictions'
                  | 'boardInviteRestrict'
                  | 'externalMembersDisabled'
                  | 'orgInviteRestrict'
                  | 'permissionLevel'
                >
                & {
                  boardDeleteRestrict?: Types.Maybe<(
                    { __typename: 'Organization_Prefs_BoardDeleteRestrict' }
                    & Pick<
                      Types.Organization_Prefs_BoardDeleteRestrict,
                      | 'enterprise'
                      | 'org'
                      | 'private'
                      | 'public'
                    >
                  )>,
                  boardVisibilityRestrict?: Types.Maybe<(
                    { __typename: 'Organization_Prefs_BoardVisibilityRestrict' }
                    & Pick<
                      Types.Organization_Prefs_BoardVisibilityRestrict,
                      | 'enterprise'
                      | 'org'
                      | 'private'
                      | 'public'
                    >
                  )>,
                }
              ),
            }
          )>,
          prefs?: Types.Maybe<(
            { __typename: 'Board_Prefs' }
            & Pick<
              Types.Board_Prefs,
              | 'background'
              | 'backgroundBottomColor'
              | 'backgroundBrightness'
              | 'backgroundColor'
              | 'backgroundDarkImage'
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
          )>,
        }
      )>,
      boardStars: Array<(
        { __typename: 'BoardStar' }
        & Pick<Types.BoardStar, 'id' | 'idBoard' | 'pos'>
      )>,
      organizations: Array<(
        { __typename: 'Organization' }
        & Pick<Types.Organization, 'id' | 'premiumFeatures'>
        & {
          credits: Array<(
            { __typename: 'Credit' }
            & Pick<
              Types.Credit,
              | 'id'
              | 'applied'
              | 'count'
              | 'countType'
              | 'idMemberInvited'
              | 'idModel'
              | 'modelType'
              | 'reward'
              | 'type'
              | 'via'
            >
          )>,
          limits: (
            { __typename: 'Organization_Limits' }
            & { orgs: (
              { __typename: 'Organization_Limits_Orgs' }
              & {
                freeBoardsPerOrg: (
                  { __typename: 'Limit' }
                  & Pick<
                    Types.Limit,
                    | 'count'
                    | 'disableAt'
                    | 'status'
                    | 'warnAt'
                  >
                ),
                totalMembersPerOrg: (
                  { __typename: 'Limit' }
                  & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
                ),
                usersPerFreeOrg: (
                  { __typename: 'Limit' }
                  & Pick<
                    Types.Limit,
                    | 'count'
                    | 'disableAt'
                    | 'status'
                    | 'warnAt'
                  >
                ),
              }
            ) }
          ),
          memberships: Array<(
            { __typename: 'Organization_Membership' }
            & Pick<
              Types.Organization_Membership,
              | 'id'
              | 'deactivated'
              | 'idMember'
              | 'memberType'
              | 'unconfirmed'
            >
          )>,
          prefs: (
            { __typename: 'Organization_Prefs' }
            & Pick<
              Types.Organization_Prefs,
              | 'associatedDomain'
              | 'attachmentRestrictions'
              | 'boardInviteRestrict'
              | 'externalMembersDisabled'
              | 'orgInviteRestrict'
              | 'permissionLevel'
            >
            & {
              boardDeleteRestrict?: Types.Maybe<(
                { __typename: 'Organization_Prefs_BoardDeleteRestrict' }
                & Pick<
                  Types.Organization_Prefs_BoardDeleteRestrict,
                  | 'enterprise'
                  | 'org'
                  | 'private'
                  | 'public'
                >
              )>,
              boardVisibilityRestrict?: Types.Maybe<(
                { __typename: 'Organization_Prefs_BoardVisibilityRestrict' }
                & Pick<
                  Types.Organization_Prefs_BoardVisibilityRestrict,
                  | 'enterprise'
                  | 'org'
                  | 'private'
                  | 'public'
                >
              )>,
            }
          ),
        }
      )>,
    }
  )> }
);

/**
 * __useMemberBoardsHomeQuery__
 *
 * To run a query within a React component, call `useMemberBoardsHomeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberBoardsHomeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberBoardsHomeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMemberBoardsHomeQuery(
  baseOptions?: Apollo.QueryHookOptions<
    MemberBoardsHomeQuery,
    MemberBoardsHomeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MemberBoardsHomeQuery, MemberBoardsHomeQueryVariables>(
    MemberBoardsHomeDocument,
    options,
  );
}
export function useMemberBoardsHomeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MemberBoardsHomeQuery,
    MemberBoardsHomeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MemberBoardsHomeQuery,
    MemberBoardsHomeQueryVariables
  >(MemberBoardsHomeDocument, options);
}
export function useMemberBoardsHomeSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        MemberBoardsHomeQuery,
        MemberBoardsHomeQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    MemberBoardsHomeQuery,
    MemberBoardsHomeQueryVariables
  >(MemberBoardsHomeDocument, options);
}
export type MemberBoardsHomeQueryHookResult = ReturnType<
  typeof useMemberBoardsHomeQuery
>;
export type MemberBoardsHomeLazyQueryHookResult = ReturnType<
  typeof useMemberBoardsHomeLazyQuery
>;
export type MemberBoardsHomeSuspenseQueryHookResult = ReturnType<
  typeof useMemberBoardsHomeSuspenseQuery
>;
export type MemberBoardsHomeQueryResult = Apollo.QueryResult<
  MemberBoardsHomeQuery,
  MemberBoardsHomeQueryVariables
>;
