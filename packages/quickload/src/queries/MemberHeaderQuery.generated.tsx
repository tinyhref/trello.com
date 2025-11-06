import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const MemberHeaderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberHeader"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"aaBlockSyncUntil"}},{"kind":"Field","name":{"kind":"Name","value":"aaEmail"}},{"kind":"Field","name":{"kind":"Name","value":"aaId"}},{"kind":"Field","name":{"kind":"Name","value":"activityBlocked"}},{"kind":"Field","name":{"kind":"Name","value":"avatarHash"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"bioData"}},{"kind":"Field","name":{"kind":"Name","value":"campaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentStep"}},{"kind":"Field","name":{"kind":"Name","value":"dateDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cohorts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userCohortGoldenPersonalProductivityEngagement"}},{"kind":"Field","name":{"kind":"Name","value":"userCohortPersonalProductivity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"credentialsRemovedCount"}},{"kind":"Field","name":{"kind":"Name","value":"domainClaimed"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseLicenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"saml"},{"kind":"EnumValue","value":"member"},{"kind":"EnumValue","value":"memberUnconfirmed"},{"kind":"EnumValue","value":"owned"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"idAdmins"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"organizationPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associatedDomain"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentRestrictions"}},{"kind":"Field","name":{"kind":"Name","value":"boardDeleteRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"boardVisibilityRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"externalMembersDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"orgInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canIssueManagedConsentTokens"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"banners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"selfServiceExpansionType"}},{"kind":"Field","name":{"kind":"Name","value":"ssoOnly"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sandbox"}},{"kind":"Field","name":{"kind":"Name","value":"sandboxExpiry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseWithRequiredConversion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mandatoryTransferDate"}},{"kind":"Field","name":{"kind":"Name","value":"ssoOnly"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"hasEnterpriseDomain"}},{"kind":"Field","name":{"kind":"Name","value":"idBoards"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprisesAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprisesDeactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprisesImplicitAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberReferrer"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganizations"}},{"kind":"Field","name":{"kind":"Name","value":"idPremOrgsAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"isAaMastered"}},{"kind":"Field","name":{"kind":"Name","value":"ixUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalPerMember"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalPerMember"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"logins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"claimable"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"types"}}]}},{"kind":"Field","name":{"kind":"Name","value":"loginTypes"}},{"kind":"Field","name":{"kind":"Name","value":"marketingOptIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"optedIn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"messagesDismissed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"lastDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodeId"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarHash"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nonPublicAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"creationMethod"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"atlOrgDisplayName"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastSelfServeAttempt"}},{"kind":"Field","name":{"kind":"Name","value":"datePendingTrueUp"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseDomains"}},{"kind":"Field","name":{"kind":"Name","value":"hasAtlassianAccess"}},{"kind":"Field","name":{"kind":"Name","value":"hasClaimedDomains"}},{"kind":"Field","name":{"kind":"Name","value":"idAdmins"}},{"kind":"Field","name":{"kind":"Name","value":"idPluginsAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"isAtlassianOrg"}},{"kind":"Field","name":{"kind":"Name","value":"isEnterpriseWithoutSSO"}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"organizationPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associatedDomain"}},{"kind":"Field","name":{"kind":"Name","value":"boardInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"boardVisibilityRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orgInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pluginWhitelistingEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canIssueManagedConsentTokens"}},{"kind":"Field","name":{"kind":"Name","value":"selfServiceExpansionType"}},{"kind":"Field","name":{"kind":"Name","value":"ssoOnly"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sandbox"}},{"kind":"Field","name":{"kind":"Name","value":"sandboxExpiry"}},{"kind":"Field","name":{"kind":"Name","value":"ssoActivationFailed"}},{"kind":"Field","name":{"kind":"Name","value":"ssoDateDelayed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseJoinRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idEntitlement"}},{"kind":"Field","name":{"kind":"Name","value":"jwmLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"crossflowTouchpoint"}},{"kind":"Field","name":{"kind":"Name","value":"entityUrl"}},{"kind":"Field","name":{"kind":"Name","value":"idCloud"}},{"kind":"Field","name":{"kind":"Name","value":"inaccessible"}}]}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billingDates"}},{"kind":"Field","name":{"kind":"Name","value":"canRenew"}},{"kind":"Field","name":{"kind":"Name","value":"cardLast4"}},{"kind":"Field","name":{"kind":"Name","value":"cardType"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactFullName"}},{"kind":"Field","name":{"kind":"Name","value":"contactLocale"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"dateFirstSubscription"}},{"kind":"Field","name":{"kind":"Name","value":"datePendingDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDates"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceDetails"}},{"kind":"Field","name":{"kind":"Name","value":"isVatRegistered"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriber"}},{"kind":"Field","name":{"kind":"Name","value":"needsCreditCardUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"paidProduct"}},{"kind":"Field","name":{"kind":"Name","value":"previousSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dtCancelled"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProductId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productOverride"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"autoUpgrade"}},{"kind":"Field","name":{"kind":"Name","value":"dateEnd"}},{"kind":"Field","name":{"kind":"Name","value":"dateStart"}},{"kind":"Field","name":{"kind":"Name","value":"product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledChange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nextChangeTimestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"stateTaxId"}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"trialExpiration"}},{"kind":"Field","name":{"kind":"Name","value":"trialType"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pluginData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"idModel"}},{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colorBlind"}},{"kind":"Field","name":{"kind":"Name","value":"keyboardShortcutsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"minutesBeforeDeadlineToNotify"}},{"kind":"Field","name":{"kind":"Name","value":"minutesBetweenSummaries"}},{"kind":"Field","name":{"kind":"Name","value":"privacy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timezoneInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateNext"}},{"kind":"Field","name":{"kind":"Name","value":"offsetCurrent"}},{"kind":"Field","name":{"kind":"Name","value":"offsetNext"}},{"kind":"Field","name":{"kind":"Name","value":"timezoneCurrent"}},{"kind":"Field","name":{"kind":"Name","value":"timezoneNext"}}]}},{"kind":"Field","name":{"kind":"Name","value":"twoFactor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"needsNewBackups"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"requiresAaOnboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"template"}}]}},{"kind":"Field","name":{"kind":"Name","value":"savedSearches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"query"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sessionType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"trophies"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MemberHeader","document":MemberHeaderDocument}} as const;
export type MemberHeaderQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type MemberHeaderQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<
      Types.Member,
      | 'id'
      | 'aaBlockSyncUntil'
      | 'aaEmail'
      | 'aaId'
      | 'activityBlocked'
      | 'avatarHash'
      | 'avatarUrl'
      | 'bio'
      | 'bioData'
      | 'confirmed'
      | 'credentialsRemovedCount'
      | 'domainClaimed'
      | 'email'
      | 'fullName'
      | 'hasEnterpriseDomain'
      | 'idBoards'
      | 'idEnterprise'
      | 'idEnterprisesAdmin'
      | 'idEnterprisesDeactivated'
      | 'idEnterprisesImplicitAdmin'
      | 'idMemberReferrer'
      | 'idOrganizations'
      | 'idPremOrgsAdmin'
      | 'initials'
      | 'isAaMastered'
      | 'ixUpdate'
      | 'loginTypes'
      | 'memberType'
      | 'nodeId'
      | 'nonPublicAvailable'
      | 'oneTimeMessagesDismissed'
      | 'premiumFeatures'
      | 'products'
      | 'sessionType'
      | 'status'
      | 'trophies'
      | 'url'
      | 'username'
    >
    & {
      campaigns: Array<(
        { __typename: 'Campaign' }
        & Pick<
          Types.Campaign,
          | 'id'
          | 'currentStep'
          | 'dateDismissed'
          | 'name'
        >
      )>,
      cohorts?: Types.Maybe<(
        { __typename: 'Cohorts' }
        & Pick<Types.Cohorts, 'userCohortGoldenPersonalProductivityEngagement' | 'userCohortPersonalProductivity'>
      )>,
      enterpriseLicenses?: Types.Maybe<Array<(
        { __typename: 'Member_EnterpriseLicense' }
        & Pick<Types.Member_EnterpriseLicense, 'idEnterprise' | 'type'>
      )>>,
      enterprises: Array<(
        { __typename: 'Enterprise' }
        & Pick<
          Types.Enterprise,
          | 'id'
          | 'displayName'
          | 'idAdmins'
          | 'logoUrl'
          | 'name'
          | 'offering'
          | 'sandbox'
          | 'sandboxExpiry'
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
            & Pick<Types.Enterprise_Prefs, 'canIssueManagedConsentTokens' | 'selfServiceExpansionType' | 'ssoOnly'>
            & { notifications?: Types.Maybe<(
              { __typename: 'EnterpriseNotifications' }
              & { banners?: Types.Maybe<Array<(
                { __typename: 'EnterpriseNotificationBanner' }
                & Pick<Types.EnterpriseNotificationBanner, 'id' | 'message'>
              )>> }
            )> }
          )>,
        }
      )>,
      enterpriseWithRequiredConversion?: Types.Maybe<(
        { __typename: 'Member_EnterpriseWithRequiredConversion' }
        & Pick<Types.Member_EnterpriseWithRequiredConversion, 'displayName'>
        & { prefs?: Types.Maybe<(
          { __typename: 'Member_EnterpriseWithRequiredConversionPrefs' }
          & Pick<Types.Member_EnterpriseWithRequiredConversionPrefs, 'mandatoryTransferDate' | 'ssoOnly'>
        )> }
      )>,
      limits: (
        { __typename: 'Member_Limits' }
        & {
          boards: (
            { __typename: 'Member_Limits_Boards' }
            & { totalPerMember: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
            ) }
          ),
          orgs: (
            { __typename: 'Member_Limits_Orgs' }
            & { totalPerMember: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
            ) }
          ),
        }
      ),
      logins: Array<(
        { __typename: 'Login' }
        & Pick<
          Types.Login,
          | 'id'
          | 'claimable'
          | 'email'
          | 'primary'
          | 'types'
        >
      )>,
      marketingOptIn?: Types.Maybe<(
        { __typename: 'Member_MarketingOptIn' }
        & Pick<Types.Member_MarketingOptIn, 'date' | 'optedIn'>
      )>,
      messagesDismissed?: Types.Maybe<Array<(
        { __typename: 'Member_MessageDismissed' }
        & Pick<
          Types.Member_MessageDismissed,
          | 'id'
          | '_id'
          | 'count'
          | 'lastDismissed'
          | 'name'
        >
      )>>,
      nonPublic?: Types.Maybe<(
        { __typename: 'Member_NonPublic' }
        & Pick<
          Types.Member_NonPublic,
          | 'avatarHash'
          | 'avatarUrl'
          | 'fullName'
          | 'initials'
        >
      )>,
      organizations: Array<(
        { __typename: 'Organization' }
        & Pick<
          Types.Organization,
          | 'id'
          | 'creationMethod'
          | 'displayName'
          | 'idEnterprise'
          | 'idEntitlement'
          | 'logoHash'
          | 'name'
          | 'offering'
          | 'premiumFeatures'
          | 'products'
          | 'type'
        >
        & {
          enterprise?: Types.Maybe<(
            { __typename: 'Enterprise' }
            & Pick<
              Types.Enterprise,
              | 'id'
              | 'atlOrgDisplayName'
              | 'dateLastSelfServeAttempt'
              | 'datePendingTrueUp'
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
              | 'sandbox'
              | 'sandboxExpiry'
              | 'ssoActivationFailed'
              | 'ssoDateDelayed'
            >
            & {
              organizationPrefs: (
                { __typename: 'Enterprise_Organization_Prefs' }
                & Pick<
                  Types.Enterprise_Organization_Prefs,
                  | 'associatedDomain'
                  | 'boardInviteRestrict'
                  | 'orgInviteRestrict'
                  | 'permissionLevel'
                >
                & { boardVisibilityRestrict?: Types.Maybe<(
                  { __typename: 'Enterprise_Organization_Prefs_BoardRestrictions' }
                  & Pick<Types.Enterprise_Organization_Prefs_BoardRestrictions, 'private' | 'public'>
                )> }
              ),
              prefs?: Types.Maybe<(
                { __typename: 'Enterprise_Prefs' }
                & Pick<Types.Enterprise_Prefs, 'canIssueManagedConsentTokens' | 'selfServiceExpansionType' | 'ssoOnly'>
              )>,
            }
          )>,
          enterpriseJoinRequest?: Types.Maybe<(
            { __typename: 'EnterpriseJoinRequest' }
            & Pick<Types.EnterpriseJoinRequest, 'date' | 'idEnterprise' | 'idMember'>
          )>,
          jwmLink?: Types.Maybe<(
            { __typename: 'JwmWorkspaceLink' }
            & Pick<
              Types.JwmWorkspaceLink,
              | 'crossflowTouchpoint'
              | 'entityUrl'
              | 'idCloud'
              | 'inaccessible'
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
              | 'datePendingDisabled'
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
        }
      )>,
      pluginData: Array<(
        { __typename: 'PluginData' }
        & Pick<
          Types.PluginData,
          | 'id'
          | 'access'
          | 'idModel'
          | 'idPlugin'
          | 'scope'
          | 'value'
        >
      )>,
      prefs?: Types.Maybe<(
        { __typename: 'Member_Prefs' }
        & Pick<
          Types.Member_Prefs,
          | 'colorBlind'
          | 'keyboardShortcutsEnabled'
          | 'locale'
          | 'minutesBeforeDeadlineToNotify'
          | 'minutesBetweenSummaries'
        >
        & {
          privacy: (
            { __typename: 'Member_Prefs_Privacy' }
            & Pick<Types.Member_Prefs_Privacy, 'avatar' | 'fullName'>
          ),
          timezoneInfo: (
            { __typename: 'Member_Prefs_TimezoneInfo' }
            & Pick<
              Types.Member_Prefs_TimezoneInfo,
              | 'dateNext'
              | 'offsetCurrent'
              | 'offsetNext'
              | 'timezoneCurrent'
              | 'timezoneNext'
            >
          ),
          twoFactor?: Types.Maybe<(
            { __typename: 'Member_Prefs_TwoFactor' }
            & Pick<Types.Member_Prefs_TwoFactor, 'enabled' | 'needsNewBackups'>
          )>,
        }
      )>,
      requiresAaOnboarding?: Types.Maybe<(
        { __typename: 'RequiresAaOnboarding' }
        & Pick<Types.RequiresAaOnboarding, 'template'>
        & {
          enterprise?: Types.Maybe<(
            { __typename: 'Enterprise' }
            & Pick<Types.Enterprise, 'id' | 'displayName'>
          )>,
          profile?: Types.Maybe<(
            { __typename: 'AaOnboardingProfile' }
            & Pick<Types.AaOnboardingProfile, 'avatarUrl' | 'fullName'>
          )>,
        }
      )>,
      savedSearches: Array<(
        { __typename: 'SavedSearch' }
        & Pick<
          Types.SavedSearch,
          | 'id'
          | 'name'
          | 'pos'
          | 'query'
        >
      )>,
    }
  )> }
);

/**
 * __useMemberHeaderQuery__
 *
 * To run a query within a React component, call `useMemberHeaderQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberHeaderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberHeaderQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMemberHeaderQuery(
  baseOptions: Apollo.QueryHookOptions<
    MemberHeaderQuery,
    MemberHeaderQueryVariables
  > &
    (
      | { variables: MemberHeaderQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MemberHeaderQuery, MemberHeaderQueryVariables>(
    MemberHeaderDocument,
    options,
  );
}
export function useMemberHeaderLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MemberHeaderQuery,
    MemberHeaderQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MemberHeaderQuery, MemberHeaderQueryVariables>(
    MemberHeaderDocument,
    options,
  );
}
export function useMemberHeaderSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        MemberHeaderQuery,
        MemberHeaderQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<MemberHeaderQuery, MemberHeaderQueryVariables>(
    MemberHeaderDocument,
    options,
  );
}
export type MemberHeaderQueryHookResult = ReturnType<
  typeof useMemberHeaderQuery
>;
export type MemberHeaderLazyQueryHookResult = ReturnType<
  typeof useMemberHeaderLazyQuery
>;
export type MemberHeaderSuspenseQueryHookResult = ReturnType<
  typeof useMemberHeaderSuspenseQuery
>;
export type MemberHeaderQueryResult = Apollo.QueryResult<
  MemberHeaderQuery,
  MemberHeaderQueryVariables
>;
