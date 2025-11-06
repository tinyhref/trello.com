import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const WorkspaceBoardsPageMinimalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceBoardsPageMinimal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"billableCollaboratorCount"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardsCount"},"value":{"kind":"IntValue","value":"29"}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"EnumValue","value":"dateLastActivity"}},{"kind":"Argument","name":{"kind":"Name","value":"sortOrder"},"value":{"kind":"EnumValue","value":"desc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"creationMethod"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"datePluginDisable"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"idTags"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBottomColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBrightness"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTopColor"}},{"kind":"Field","name":{"kind":"Name","value":"calendarFeedEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"canInvite"}},{"kind":"Field","name":{"kind":"Name","value":"cardAging"}},{"kind":"Field","name":{"kind":"Name","value":"cardCovers"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"hideVotes"}},{"kind":"Field","name":{"kind":"Name","value":"invitations"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}},{"kind":"Field","name":{"kind":"Name","value":"selfJoin"}},{"kind":"Field","name":{"kind":"Name","value":"voting"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"shortUrl"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"applied"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"countType"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberInvited"}},{"kind":"Field","name":{"kind":"Name","value":"idModel"}},{"kind":"Field","name":{"kind":"Name","value":"modelType"}},{"kind":"Field","name":{"kind":"Name","value":"reward"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"via"}}]}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"descData"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"atlOrgDisplayName"}},{"kind":"Field","name":{"kind":"Name","value":"atlOrgId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseDomains"}},{"kind":"Field","name":{"kind":"Name","value":"hasAtlassianAccess"}},{"kind":"Field","name":{"kind":"Name","value":"hasClaimedDomains"}},{"kind":"Field","name":{"kind":"Name","value":"idAdmins"}},{"kind":"Field","name":{"kind":"Name","value":"idPluginsAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"isAtlassianOrg"}},{"kind":"Field","name":{"kind":"Name","value":"isEnterpriseWithoutSSO"}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"organizationPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associatedDomain"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentRestrictions"}},{"kind":"Field","name":{"kind":"Name","value":"boardDeleteRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"boardVisibilityRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"externalMembersDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"orgInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pluginWhitelistingEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canIssueManagedConsentTokens"}},{"kind":"Field","name":{"kind":"Name","value":"ssoOnly"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ssoActivationFailed"}},{"kind":"Field","name":{"kind":"Name","value":"ssoDateDelayed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeBoardsPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalMembersPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usersPerFreeOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"active"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billingDates"}},{"kind":"Field","name":{"kind":"Name","value":"canRenew"}},{"kind":"Field","name":{"kind":"Name","value":"cardLast4"}},{"kind":"Field","name":{"kind":"Name","value":"cardType"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactFullName"}},{"kind":"Field","name":{"kind":"Name","value":"contactLocale"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"dateFirstSubscription"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDates"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceDetails"}},{"kind":"Field","name":{"kind":"Name","value":"isVatRegistered"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriber"}},{"kind":"Field","name":{"kind":"Name","value":"needsCreditCardUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"paidProduct"}},{"kind":"Field","name":{"kind":"Name","value":"previousSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dtCancelled"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProductId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productOverride"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"autoUpgrade"}},{"kind":"Field","name":{"kind":"Name","value":"dateEnd"}},{"kind":"Field","name":{"kind":"Name","value":"dateStart"}},{"kind":"Field","name":{"kind":"Name","value":"product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledChange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nextChangeTimestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"stateTaxId"}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"trialExpiration"}},{"kind":"Field","name":{"kind":"Name","value":"trialType"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associatedDomain"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentRestrictions"}},{"kind":"Field","name":{"kind":"Name","value":"boardDeleteRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"boardVisibilityRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"externalMembersDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"orgInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"website"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"WorkspaceBoardsPageMinimal","document":WorkspaceBoardsPageMinimalDocument}} as const;
export type WorkspaceBoardsPageMinimalQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type WorkspaceBoardsPageMinimalQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<
      Types.Organization,
      | 'id'
      | 'billableCollaboratorCount'
      | 'desc'
      | 'descData'
      | 'displayName'
      | 'idEnterprise'
      | 'logoHash'
      | 'name'
      | 'offering'
      | 'premiumFeatures'
      | 'products'
      | 'type'
      | 'website'
    >
    & {
      boards: Array<(
        { __typename: 'Board' }
        & Pick<
          Types.Board,
          | 'id'
          | 'closed'
          | 'creationMethod'
          | 'dateLastActivity'
          | 'datePluginDisable'
          | 'enterpriseOwned'
          | 'idEnterprise'
          | 'idOrganization'
          | 'idTags'
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
      enterprise?: Types.Maybe<(
        { __typename: 'Enterprise' }
        & Pick<
          Types.Enterprise,
          | 'id'
          | 'accessEnabled'
          | 'atlOrgDisplayName'
          | 'atlOrgId'
          | 'displayName'
          | 'enterpriseDomains'
          | 'hasAtlassianAccess'
          | 'hasClaimedDomains'
          | 'idAdmins'
          | 'idPluginsAllowed'
          | 'isAtlassianOrg'
          | 'isEnterpriseWithoutSSO'
          | 'logoHash'
          | 'logoUrl'
          | 'name'
          | 'offering'
          | 'pluginWhitelistingEnabled'
          | 'ssoActivationFailed'
          | 'ssoDateDelayed'
        >
        & {
          organizationPrefs: (
            { __typename: 'Enterprise_Organization_Prefs' }
            & Pick<
              Types.Enterprise_Organization_Prefs,
              | 'associatedDomain'
              | 'attachmentRestrictions'
              | 'boardInviteRestrict'
              | 'externalMembersDisabled'
              | 'orgInviteRestrict'
              | 'permissionLevel'
            >
            & {
              boardDeleteRestrict?: Types.Maybe<(
                { __typename: 'Enterprise_Organization_Prefs_BoardRestrictions' }
                & Pick<
                  Types.Enterprise_Organization_Prefs_BoardRestrictions,
                  | 'enterprise'
                  | 'org'
                  | 'private'
                  | 'public'
                >
              )>,
              boardVisibilityRestrict?: Types.Maybe<(
                { __typename: 'Enterprise_Organization_Prefs_BoardRestrictions' }
                & Pick<
                  Types.Enterprise_Organization_Prefs_BoardRestrictions,
                  | 'enterprise'
                  | 'org'
                  | 'private'
                  | 'public'
                >
              )>,
            }
          ),
          prefs?: Types.Maybe<(
            { __typename: 'Enterprise_Prefs' }
            & Pick<Types.Enterprise_Prefs, 'canIssueManagedConsentTokens' | 'ssoOnly'>
          )>,
        }
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
              & Pick<
                Types.Limit,
                | 'count'
                | 'disableAt'
                | 'status'
                | 'warnAt'
              >
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
      paidAccount?: Types.Maybe<(
        { __typename: 'PaidAccount' }
        & Pick<
          Types.PaidAccount,
          | 'billingDates'
          | 'canRenew'
          | 'cardLast4'
          | 'cardType'
          | 'contactEmail'
          | 'contactFullName'
          | 'contactLocale'
          | 'country'
          | 'dateFirstSubscription'
          | 'expirationDates'
          | 'invoiceDetails'
          | 'isVatRegistered'
          | 'ixSubscriber'
          | 'needsCreditCardUpdate'
          | 'paidProduct'
          | 'products'
          | 'standing'
          | 'stateTaxId'
          | 'taxId'
          | 'trialExpiration'
          | 'trialType'
          | 'zip'
        >
        & {
          previousSubscription?: Types.Maybe<(
            { __typename: 'PreviousSubscription' }
            & Pick<Types.PreviousSubscription, 'dtCancelled' | 'ixSubscriptionProductId'>
          )>,
          productOverride?: Types.Maybe<(
            { __typename: 'ProductOverride' }
            & Pick<
              Types.ProductOverride,
              | 'autoUpgrade'
              | 'dateEnd'
              | 'dateStart'
              | 'product'
            >
          )>,
          scheduledChange?: Types.Maybe<(
            { __typename: 'ScheduledChange' }
            & Pick<Types.ScheduledChange, 'ixSubscriptionProduct' | 'nextChangeTimestamp'>
          )>,
        }
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
      tags: Array<(
        { __typename: 'Tag' }
        & Pick<Types.Tag, 'id' | 'name'>
      )>,
    }
  )> }
);

/**
 * __useWorkspaceBoardsPageMinimalQuery__
 *
 * To run a query within a React component, call `useWorkspaceBoardsPageMinimalQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceBoardsPageMinimalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceBoardsPageMinimalQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useWorkspaceBoardsPageMinimalQuery(
  baseOptions: Apollo.QueryHookOptions<
    WorkspaceBoardsPageMinimalQuery,
    WorkspaceBoardsPageMinimalQueryVariables
  > &
    (
      | { variables: WorkspaceBoardsPageMinimalQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    WorkspaceBoardsPageMinimalQuery,
    WorkspaceBoardsPageMinimalQueryVariables
  >(WorkspaceBoardsPageMinimalDocument, options);
}
export function useWorkspaceBoardsPageMinimalLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    WorkspaceBoardsPageMinimalQuery,
    WorkspaceBoardsPageMinimalQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    WorkspaceBoardsPageMinimalQuery,
    WorkspaceBoardsPageMinimalQueryVariables
  >(WorkspaceBoardsPageMinimalDocument, options);
}
export function useWorkspaceBoardsPageMinimalSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        WorkspaceBoardsPageMinimalQuery,
        WorkspaceBoardsPageMinimalQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WorkspaceBoardsPageMinimalQuery,
    WorkspaceBoardsPageMinimalQueryVariables
  >(WorkspaceBoardsPageMinimalDocument, options);
}
export type WorkspaceBoardsPageMinimalQueryHookResult = ReturnType<
  typeof useWorkspaceBoardsPageMinimalQuery
>;
export type WorkspaceBoardsPageMinimalLazyQueryHookResult = ReturnType<
  typeof useWorkspaceBoardsPageMinimalLazyQuery
>;
export type WorkspaceBoardsPageMinimalSuspenseQueryHookResult = ReturnType<
  typeof useWorkspaceBoardsPageMinimalSuspenseQuery
>;
export type WorkspaceBoardsPageMinimalQueryResult = Apollo.QueryResult<
  WorkspaceBoardsPageMinimalQuery,
  WorkspaceBoardsPageMinimalQueryVariables
>;
