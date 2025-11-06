import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const CurrentBoardInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentBoardInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"organizationDisableMock"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boardPlugins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"creationMethod"}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"display"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardFront"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastView"}},{"kind":"Field","name":{"kind":"Name","value":"datePluginDisable"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"descData"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"aiPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"atlassianIntelligenceEnabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberCreator"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"idTags"}},{"kind":"Field","name":{"kind":"Name","value":"labelNames"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"black"}},{"kind":"Field","name":{"kind":"Name","value":"blue"}},{"kind":"Field","name":{"kind":"Name","value":"green"}},{"kind":"Field","name":{"kind":"Name","value":"lime"}},{"kind":"Field","name":{"kind":"Name","value":"orange"}},{"kind":"Field","name":{"kind":"Name","value":"pink"}},{"kind":"Field","name":{"kind":"Name","value":"purple"}},{"kind":"Field","name":{"kind":"Name","value":"red"}},{"kind":"Field","name":{"kind":"Name","value":"sky"}},{"kind":"Field","name":{"kind":"Name","value":"yellow"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"all"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalMembersPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"openPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"openPerList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPerList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checkItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perChecklist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checklists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFieldOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perField"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"openPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uniquePerAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stickers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityBlocked"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"bioData"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberReferrer"}},{"kind":"Field","name":{"kind":"Name","value":"idPremOrgsAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nonPublicAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"orgMemberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aiBrowserExtensionEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"aiEmailEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"calendarKey"}},{"kind":"Field","name":{"kind":"Name","value":"emailKey"}},{"kind":"Field","name":{"kind":"Name","value":"emailPosition"}},{"kind":"Field","name":{"kind":"Name","value":"fullEmail"}},{"kind":"Field","name":{"kind":"Name","value":"idEmailList"}},{"kind":"Field","name":{"kind":"Name","value":"showCompactMirrorCards"}},{"kind":"Field","name":{"kind":"Name","value":"showSidebar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nodeId"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeBoardsPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalMembersPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usersPerFreeOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"pluginData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"idModel"}},{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associatedDomain"}},{"kind":"Field","name":{"kind":"Name","value":"atlassianIntelligenceEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentRestrictions"}},{"kind":"Field","name":{"kind":"Name","value":"boardDeleteRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"boardVisibilityRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"externalMembersDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"orgInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"website"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pluginData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"idModel"}},{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"powerUps"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"autoArchive"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBottomColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBrightness"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundDarkColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundDarkImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTopColor"}},{"kind":"Field","name":{"kind":"Name","value":"calendarFeedEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"canInvite"}},{"kind":"Field","name":{"kind":"Name","value":"cardAging"}},{"kind":"Field","name":{"kind":"Name","value":"cardCovers"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"hiddenPluginBoardButtons"}},{"kind":"Field","name":{"kind":"Name","value":"hideVotes"}},{"kind":"Field","name":{"kind":"Name","value":"invitations"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}},{"kind":"Field","name":{"kind":"Name","value":"selfJoin"}},{"kind":"Field","name":{"kind":"Name","value":"showCompleteStatus"}},{"kind":"Field","name":{"kind":"Name","value":"switcherViews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"viewType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"voting"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"shortUrl"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"templateGallery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarShape"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"blurb"}},{"kind":"Field","name":{"kind":"Name","value":"byline"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"precedence"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"copyCount"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CurrentBoardInfo","document":CurrentBoardInfoDocument}} as const;
export type CurrentBoardInfoQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  traceId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type CurrentBoardInfoQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<
      Types.Board,
      | 'id'
      | 'closed'
      | 'creationMethod'
      | 'dateLastActivity'
      | 'dateLastView'
      | 'datePluginDisable'
      | 'desc'
      | 'descData'
      | 'enterpriseOwned'
      | 'idEnterprise'
      | 'idMemberCreator'
      | 'idOrganization'
      | 'idTags'
      | 'name'
      | 'nodeId'
      | 'powerUps'
      | 'premiumFeatures'
      | 'shortLink'
      | 'shortUrl'
      | 'subscribed'
      | 'type'
      | 'url'
    >
    & {
      boardPlugins: Array<(
        { __typename: 'BoardPlugin' }
        & Pick<Types.BoardPlugin, 'id' | 'idPlugin'>
      )>,
      customFields: Array<(
        { __typename: 'CustomField' }
        & Pick<
          Types.CustomField,
          | 'id'
          | 'name'
          | 'pos'
          | 'type'
        >
        & {
          display: (
            { __typename: 'CustomField_Display' }
            & Pick<Types.CustomField_Display, 'cardFront'>
          ),
          options?: Types.Maybe<Array<(
            { __typename: 'CustomField_Option' }
            & Pick<Types.CustomField_Option, 'id' | 'color' | 'pos'>
            & { value: (
              { __typename: 'CustomField_Option_Value' }
              & Pick<Types.CustomField_Option_Value, 'text'>
            ) }
          )>>,
        }
      )>,
      enterprise?: Types.Maybe<(
        { __typename: 'Enterprise' }
        & Pick<Types.Enterprise, 'id' | 'displayName'>
        & { aiPrefs?: Types.Maybe<(
          { __typename: 'Enterprise_AI_Prefs' }
          & Pick<Types.Enterprise_Ai_Prefs, 'atlassianIntelligenceEnabled'>
        )> }
      )>,
      labelNames: (
        { __typename: 'Board_LabelNames' }
        & Pick<
          Types.Board_LabelNames,
          | 'black'
          | 'blue'
          | 'green'
          | 'lime'
          | 'orange'
          | 'pink'
          | 'purple'
          | 'red'
          | 'sky'
          | 'yellow'
        >
      ),
      labels: Array<(
        { __typename: 'Label' }
        & Pick<
          Types.Label,
          | 'id'
          | 'color'
          | 'idBoard'
          | 'name'
        >
      )>,
      limits: (
        { __typename: 'Board_Limits' }
        & {
          attachments: (
            { __typename: 'Board_Limits_Attachments' }
            & {
              perBoard: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
              ),
              perCard: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
              ),
            }
          ),
          boards: (
            { __typename: 'Board_Limits_Boards' }
            & { totalMembersPerBoard: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
            ) }
          ),
          cards: (
            { __typename: 'Board_Limits_Cards' }
            & {
              openPerBoard: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
              ),
              openPerList: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
              ),
              totalPerBoard: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
              ),
              totalPerList: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
              ),
            }
          ),
          checkItems: (
            { __typename: 'Board_Limits_CheckItems' }
            & { perChecklist: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
            ) }
          ),
          checklists: (
            { __typename: 'Board_Limits_Checklists' }
            & {
              perBoard: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
              ),
              perCard: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
              ),
            }
          ),
          customFieldOptions: (
            { __typename: 'Board_Limits_CustomFieldOptions' }
            & { perField: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
            ) }
          ),
          customFields: (
            { __typename: 'Board_Limits_CustomFields' }
            & { perBoard: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
            ) }
          ),
          labels: (
            { __typename: 'Board_Limits_Labels' }
            & { perBoard: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
            ) }
          ),
          lists: (
            { __typename: 'Board_Limits_Lists' }
            & {
              openPerBoard: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
              ),
              totalPerBoard: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
              ),
            }
          ),
          reactions: (
            { __typename: 'Board_Limits_Reactions' }
            & {
              perAction: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
              ),
              uniquePerAction: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
              ),
            }
          ),
          stickers: (
            { __typename: 'Board_Limits_Stickers' }
            & { perCard: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
            ) }
          ),
        }
      ),
      members: Array<(
        { __typename: 'Member' }
        & Pick<
          Types.Member,
          | 'id'
          | 'activityBlocked'
          | 'avatarUrl'
          | 'bio'
          | 'bioData'
          | 'confirmed'
          | 'fullName'
          | 'idEnterprise'
          | 'idMemberReferrer'
          | 'idPremOrgsAdmin'
          | 'initials'
          | 'memberType'
          | 'nonPublicAvailable'
          | 'url'
          | 'username'
        >
        & { nonPublic?: Types.Maybe<(
          { __typename: 'Member_NonPublic' }
          & Pick<Types.Member_NonPublic, 'avatarUrl' | 'fullName' | 'initials'>
        )> }
      )>,
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
      myPrefs: (
        { __typename: 'MyPrefs' }
        & Pick<
          Types.MyPrefs,
          | 'aiBrowserExtensionEnabled'
          | 'aiEmailEnabled'
          | 'calendarKey'
          | 'emailKey'
          | 'emailPosition'
          | 'fullEmail'
          | 'idEmailList'
          | 'showCompactMirrorCards'
          | 'showSidebar'
        >
      ),
      organization?: Types.Maybe<(
        { __typename: 'Organization' }
        & Pick<
          Types.Organization,
          | 'id'
          | 'desc'
          | 'displayName'
          | 'idEnterprise'
          | 'logoHash'
          | 'name'
          | 'offering'
          | 'premiumFeatures'
          | 'products'
          | 'url'
          | 'website'
        >
        & {
          enterprise?: Types.Maybe<(
            { __typename: 'Enterprise' }
            & Pick<Types.Enterprise, 'id' | 'displayName'>
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
          prefs: (
            { __typename: 'Organization_Prefs' }
            & Pick<
              Types.Organization_Prefs,
              | 'associatedDomain'
              | 'atlassianIntelligenceEnabled'
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
        { __typename: 'Board_Prefs' }
        & Pick<
          Types.Board_Prefs,
          | 'autoArchive'
          | 'background'
          | 'backgroundBottomColor'
          | 'backgroundBrightness'
          | 'backgroundColor'
          | 'backgroundDarkColor'
          | 'backgroundDarkImage'
          | 'backgroundImage'
          | 'backgroundTile'
          | 'backgroundTopColor'
          | 'calendarFeedEnabled'
          | 'canInvite'
          | 'cardAging'
          | 'cardCovers'
          | 'comments'
          | 'hiddenPluginBoardButtons'
          | 'hideVotes'
          | 'invitations'
          | 'isTemplate'
          | 'permissionLevel'
          | 'selfJoin'
          | 'showCompleteStatus'
          | 'voting'
        >
        & {
          backgroundImageScaled?: Types.Maybe<Array<(
            { __typename: 'Board_Prefs_BackgroundImageScaled' }
            & Pick<Types.Board_Prefs_BackgroundImageScaled, 'height' | 'url' | 'width'>
          )>>,
          switcherViews: Array<(
            { __typename: 'Board_Prefs_SwitcherView' }
            & Pick<Types.Board_Prefs_SwitcherView, 'enabled' | 'viewType'>
          )>,
        }
      )>,
      templateGallery?: Types.Maybe<(
        { __typename: 'TemplateGallery' }
        & Pick<
          Types.TemplateGallery,
          | 'avatarShape'
          | 'avatarUrl'
          | 'blurb'
          | 'byline'
          | 'category'
          | 'featured'
          | 'precedence'
        >
        & { stats: (
          { __typename: 'Board_Stats' }
          & Pick<Types.Board_Stats, 'copyCount' | 'viewCount'>
        ) }
      )>,
    }
  )> }
);

/**
 * __useCurrentBoardInfoQuery__
 *
 * To run a query within a React component, call `useCurrentBoardInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentBoardInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentBoardInfoQuery({
 *   variables: {
 *      id: // value for 'id'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useCurrentBoardInfoQuery(
  baseOptions: Apollo.QueryHookOptions<
    CurrentBoardInfoQuery,
    CurrentBoardInfoQueryVariables
  > &
    (
      | { variables: CurrentBoardInfoQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CurrentBoardInfoQuery, CurrentBoardInfoQueryVariables>(
    CurrentBoardInfoDocument,
    options,
  );
}
export function useCurrentBoardInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CurrentBoardInfoQuery,
    CurrentBoardInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    CurrentBoardInfoQuery,
    CurrentBoardInfoQueryVariables
  >(CurrentBoardInfoDocument, options);
}
export function useCurrentBoardInfoSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        CurrentBoardInfoQuery,
        CurrentBoardInfoQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    CurrentBoardInfoQuery,
    CurrentBoardInfoQueryVariables
  >(CurrentBoardInfoDocument, options);
}
export type CurrentBoardInfoQueryHookResult = ReturnType<
  typeof useCurrentBoardInfoQuery
>;
export type CurrentBoardInfoLazyQueryHookResult = ReturnType<
  typeof useCurrentBoardInfoLazyQuery
>;
export type CurrentBoardInfoSuspenseQueryHookResult = ReturnType<
  typeof useCurrentBoardInfoSuspenseQuery
>;
export type CurrentBoardInfoQueryResult = Apollo.QueryResult<
  CurrentBoardInfoQuery,
  CurrentBoardInfoQueryVariables
>;
