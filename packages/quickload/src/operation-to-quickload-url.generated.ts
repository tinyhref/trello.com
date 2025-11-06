/**
 * ❗️❗️❗️
 * THIS IS A GENERATED FILE. DO NOT MODIFY DIRECTLY!
 * Add your changes to 'packages/quickload/src/requests.ts' and run '$ npm --workspace @trello/quickload run build' instead.
 */
import type { SimpleOperationMap } from '../src/quickload.types';

export const OperationToQuickloadUrl: SimpleOperationMap = {
  MemberHeader: {
    url: '/1/member/:idMember?fields=id%2CaaBlockSyncUntil%2CaaEmail%2CaaId%2CactivityBlocked%2CavatarHash%2CavatarUrl%2Cbio%2CbioData%2Cconfirmed%2CcredentialsRemovedCount%2CdomainClaimed%2Cemail%2CfullName%2ChasEnterpriseDomain%2CidBoards%2CidEnterprise%2CidEnterprisesAdmin%2CidEnterprisesDeactivated%2CidEnterprisesImplicitAdmin%2CidMemberReferrer%2CidOrganizations%2CidPremOrgsAdmin%2Cinitials%2CisAaMastered%2CixUpdate%2Climits%2CloginTypes%2CmarketingOptIn%2CmemberType%2CmessagesDismissed%2CnodeId%2CnonPublic%2CnonPublicAvailable%2ConeTimeMessagesDismissed%2Cprefs%2CpremiumFeatures%2Cproducts%2CrequiresAaOnboarding%2CsessionType%2Cstatus%2Ctrophies%2Curl%2Cusername&campaigns=true&cohorts=true&enterpriseLicenses=true&enterprises=true&enterprise_filter=saml%2Cmember%2Cmember-unconfirmed%2Cowned&enterprise_fields=id%2CdisplayName%2CidAdmins%2ClogoUrl%2Cname%2Coffering%2CorganizationPrefs%2Cprefs%2Csandbox%2CsandboxExpiry&enterpriseWithRequiredConversion=true&logins=true&organizations=all&organization_fields=id%2CcreationMethod%2CdisplayName%2CenterpriseJoinRequest%2CidEnterprise%2CidEntitlement%2CjwmLink%2ClogoHash%2Cname%2Coffering%2CpremiumFeatures%2Cproducts%2Ctype&organization_enterprise=true&organization_paidAccount=true&organization_paidAccount_fields=billingDates%2CcanRenew%2CcardLast4%2CcardType%2CcontactEmail%2CcontactFullName%2CcontactLocale%2Ccountry%2CdateFirstSubscription%2CdatePendingDisabled%2CexpirationDates%2CinvoiceDetails%2CisVatRegistered%2CixSubscriber%2CneedsCreditCardUpdate%2CpaidProduct%2CpreviousSubscription%2CproductOverride%2Cproducts%2CscheduledChange%2Cstanding%2CstateTaxId%2CtaxId%2CtrialExpiration%2CtrialType%2Czip&pluginData=true&savedSearches=true',
    rootId: ':idMember',
    operationName: 'quickload:MemberHeader',
    modelName: 'Member',
  },
  MemberBoards: {
    url: '/1/member/:idMember?fields=id&boards=open%2Cstarred&board_fields=id%2Cclosed%2CcreationMethod%2CdateLastActivity%2CdateLastView%2CdatePluginDisable%2CenterpriseOwned%2CidEnterprise%2CidOrganization%2Cname%2CnodeId%2Cprefs%2CpremiumFeatures%2CshortLink%2CshortUrl%2Cstarred%2Csubscribed%2Curl&board_memberships=me&board_organization=true&board_organization_fields=id%2CdisplayName%2CidEnterprise%2ClogoHash%2Cname%2Coffering&boardStars=true&organizations=all&organization_fields=id%2Ccredits%2CdisplayName%2CidEnterprise%2Climits%2ClogoHash%2Cname%2Coffering%2Cprefs%2CpremiumFeatures%2Cproducts',
    rootId: ':idMember',
    operationName: 'quickload:MemberBoards',
    modelName: 'Member',
  },
  TrelloMemberBoards: {
    url: '/gateway/api/graphql',
    rootId: ':idMember',
    operationName: 'quickload:TrelloMemberBoards',
    modelName: 'TrelloMember',
    graphQLPayload: {
      query:
        'query TrelloMemberBoards{trello{__typename me@optIn(to:"TrelloMe"){id __typename boardStars{__typename edges{id __typename boardObjectId objectId position}}}}}',
      variables: {
        id: ':idMember',
      },
      operationName: 'TrelloMemberBoards',
    },
  },
  CurrentBoardInfo: {
    url: '/1/board/:idBoard?fields=id%2Cclosed%2CcreationMethod%2CdateLastActivity%2CdateLastView%2CdatePluginDisable%2Cdesc%2CdescData%2CenterpriseOwned%2CidEnterprise%2CidMemberCreator%2CidOrganization%2CidTags%2ClabelNames%2Climits%2Cmemberships%2Cname%2CnodeId%2CpowerUps%2Cprefs%2CpremiumFeatures%2CshortLink%2CshortUrl%2Csubscribed%2CtemplateGallery%2Ctype%2Curl&organization_disable_mock=true&boardPlugins=true&customFields=true&enterprise=true&enterprise_fields=id%2CaiPrefs%2CdisplayName&labels=all&label_fields=id%2Ccolor%2CidBoard%2Cname&labels_limit=1000&members=all&member_fields=id%2CactivityBlocked%2CavatarUrl%2Cbio%2CbioData%2Cconfirmed%2CfullName%2CidEnterprise%2CidMemberReferrer%2CidPremOrgsAdmin%2Cinitials%2CmemberType%2CnonPublic%2CnonPublicAvailable%2Curl%2Cusername&memberships_orgMemberType=true&myPrefs=true&organization=true&organization_fields=id%2Cdesc%2CdisplayName%2CidEnterprise%2Climits%2ClogoHash%2Cmemberships%2Cname%2Coffering%2Cprefs%2CpremiumFeatures%2Cproducts%2Curl%2Cwebsite&organization_enterprise=true&organization_memberships=all&organization_pluginData=true&organization_tags=true&pluginData=true',
    rootId: ':idBoard',
    operationName: 'quickload:CurrentBoardInfo',
    modelName: 'Board',
  },
  CurrentBoardListsCards: {
    url: '/1/board/:idBoard?fields=id&cards=visible&card_fields=id%2Caddress%2Cbadges%2CcardRole%2Cclosed%2Ccoordinates%2Ccover%2CcreationMethod%2CcreationMethodError%2CcreationMethodLoadingStartedAt%2CdateLastActivity%2Cdesc%2CdescData%2Cdue%2CdueComplete%2CdueReminder%2CfaviconUrl%2CidAttachmentCover%2CidBoard%2CidLabels%2CidList%2CidMembers%2CidShort%2CisTemplate%2Clabels%2Climits%2ClocationName%2CmirrorSourceId%2Cname%2CnodeId%2CoriginalDesc%2CoriginalName%2Cpinned%2Cpos%2CrecurrenceRule%2CshortLink%2CshortUrl%2CsingleInstrumentationId%2Cstart%2Csubscribed%2Curl%2CurlSource%2CurlSourceText&card_attachments=true&card_attachment_fields=id%2Cbytes%2Cdate%2CedgeColor%2CfileName%2CidMember%2CisMalicious%2CisUpload%2CmimeType%2Cname%2Cpos%2Curl&card_checklists=all&card_checklist_fields=id%2CidBoard%2CidCard%2Cname%2Cpos&card_checklist_checkItems=none&card_customFieldItems=true&card_pluginData=true&card_stickers=true&lists=open&list_fields=id%2Cclosed%2Ccolor%2CcreationMethod%2Cdatasource%2CidBoard%2Climits%2Cname%2CnodeId%2Cpos%2CsoftLimit%2Csubscribed%2Ctype',
    rootId: ':idBoard',
    operationName: 'quickload:CurrentBoardListsCards',
    modelName: 'Board',
  },
  TrelloCurrentBoardInfo: {
    url: '/gateway/api/graphql',
    rootId: ':idBoard',
    operationName: 'quickload:TrelloCurrentBoardInfo',
    modelName: 'TrelloBoard',
    dynamicConfig: {
      key: 'trello_web_native_current_board_info',
      value: true,
    },
    graphQLPayload: {
      query:
        'query TrelloCurrentBoardInfo($id:TrelloShortLink!){trello{__typename boardByShortLink(shortLink:$id)@optIn(to:"TrelloBoard"){id __typename closed creationMethod creator{id __typename objectId}customFields{__typename edges{__typename node{id __typename display{__typename cardFront}name objectId options{__typename color objectId position value{__typename text}}position type}}}description{__typename text}enterprise{id __typename displayName objectId}enterpriseOwned galleryInfo{id __typename avatarShape avatarUrl blurb byline category{__typename key}featured language{__typename description enabled language locale localizedDescription}precedence stats{__typename copyCount viewCount}}labels(first:-1){__typename edges{__typename node{id __typename color name objectId}}}lastActivityAt limits{__typename attachments{__typename perBoard{__typename disableAt status warnAt}perCard{__typename disableAt status warnAt}}boards{__typename totalMembersPerBoard{__typename disableAt status warnAt}}cards{__typename openPerBoard{__typename disableAt status warnAt}openPerList{__typename disableAt status warnAt}totalPerBoard{__typename disableAt status warnAt}totalPerList{__typename disableAt status warnAt}}checkItems{__typename perChecklist{__typename disableAt status warnAt}}checklists{__typename perBoard{__typename disableAt status warnAt}perCard{__typename disableAt status warnAt}}customFieldOptions{__typename perField{__typename disableAt status warnAt}}customFields{__typename perBoard{__typename disableAt status warnAt}}labels{__typename perBoard{__typename disableAt status warnAt}}lists{__typename openPerBoard{__typename disableAt status warnAt}totalPerBoard{__typename disableAt status warnAt}}reactions{__typename perAction{__typename disableAt status warnAt}uniquePerAction{__typename disableAt status warnAt}}stickers{__typename perCard{__typename disableAt status warnAt}}}members(first:-1){__typename edges{__typename membership{__typename deactivated objectId type unconfirmed workspaceMemberType}node{id __typename activityBlocked avatarUrl bio bioData confirmed enterprise{id __typename objectId}fullName initials nonPublicData{__typename avatarUrl fullName initials}objectId url username}}}name objectId powerUpData(first:-1){__typename edges{__typename node{id __typename access objectId powerUp{__typename objectId}scope value}}}powerUps(filter:{access:"enabled"},first:-1){__typename edges{__typename node{__typename objectId}objectId}}prefs{__typename background{__typename bottomColor brightness color image imageScaled{__typename height url width}tile topColor}calendarFeedEnabled canInvite cardAging cardCovers comments hiddenPowerUpBoardButtons{__typename objectId}hideVotes invitations isTemplate permissionLevel selfJoin showCompleteStatus switcherViews{__typename enabled viewType}voting}premiumFeatures shortLink shortUrl tags(first:-1){__typename edges{__typename node{__typename objectId}}}url viewer{__typename calendarKey email{__typename key list{id __typename objectId}position}lastSeenAt sidebar{__typename show}subscribed}workspace{id __typename description displayName enterprise{id __typename admins(first:-1){__typename edges{__typename node{id __typename}}}displayName objectId}limits{__typename freeBoards{__typename disableAt status warnAt}freeCollaborators{__typename disableAt status warnAt}totalMembers{__typename disableAt status warnAt}}logoHash members(first:-1){__typename edges{__typename membership{__typename deactivated objectId type unconfirmed}node{id __typename objectId}}}name objectId offering prefs{__typename associatedDomain attachmentRestrictions boardDeleteRestrict{__typename enterprise org private public}boardInviteRestrict boardVisibilityRestrict{__typename enterprise org private public}externalMembersDisabled orgInviteRestrict permissionLevel}products tags(first:-1){__typename edges{__typename node{__typename name objectId}}}url website}}}}',
      variables: {
        id: ':idBoard',
      },
      operationName: 'TrelloCurrentBoardInfo',
    },
  },
  TrelloCurrentBoardListsCards: {
    url: '/gateway/api/graphql',
    rootId: ':idBoard',
    operationName: 'quickload:TrelloCurrentBoardListsCards',
    modelName: 'TrelloBoard',
    dynamicConfig: {
      key: 'trello_web_native_current_board_lists_cards',
      value: true,
    },
    graphQLPayload: {
      query:
        'query TrelloCurrentBoardListsCards($id:TrelloShortLink!){trello{__typename boardByShortLink(shortLink:$id)@optIn(to:"TrelloBoard"){id __typename lists(first:-1){__typename edges{__typename node{id __typename cards(first:-1)@optIn(to:"TrelloListCards"){__typename edges{__typename node{id __typename...on TrelloCard{labels(first:-1){__typename edges{__typename node{id __typename color name objectId}}}}}}}}}}}}}',
      variables: {
        id: ':idBoard',
      },
      operationName: 'TrelloCurrentBoardListsCards',
    },
  },
  TrelloBoardMirrorCards: {
    url: '/gateway/api/graphql',
    rootId: ':idBoard',
    operationName: 'quickload:TrelloBoardMirrorCards',
    modelName: 'TrelloBoard',
    graphQLPayload: {
      query:
        'query TrelloBoardMirrorCards($id:TrelloShortLink!){trello{__typename boardMirrorCardInfo(shortLink:$id)@optIn(to:"TrelloBoardMirrorCardInfo"){id __typename mirrorCards{__typename edges{__typename node{id __typename mirrorCard{id __typename}sourceBoard{id __typename closed customFields{__typename edges{__typename node{id __typename display{__typename cardFront}name objectId options{__typename color objectId position value{__typename text}}position type}}}enterprise{id __typename objectId}labels(first:-1){__typename edges{__typename node{id __typename color name objectId}}}name objectId powerUps{__typename edges{__typename node{__typename objectId}objectId}}prefs{__typename background{__typename brightness color image imageScaled{__typename height url width}tile topColor}cardAging cardCovers showCompleteStatus}shortLink url workspace{id __typename objectId}}sourceCard{id __typename attachments(first:-1){__typename edges{__typename node{id __typename isMalicious objectId}}}badges{__typename attachments attachmentsByType{__typename trello{__typename board card}}checkItems checkItemsChecked checkItemsEarliestDue comments description due{__typename at complete}externalSource lastUpdatedByAi location maliciousAttachments startedAt viewer{__typename subscribed voted}votes}checklists(first:-1){__typename edges{__typename node{id __typename objectId}}}closed complete cover{__typename attachment{id __typename objectId}brightness color edgeColor powerUp{__typename objectId}previews{__typename edges{__typename node{__typename bytes height objectId scaled url width}}}sharedSourceUrl size uploadedBackground{__typename objectId}}creation{__typename loadingStartedAt method}customFieldItems(first:-1){__typename edges{__typename node{__typename customField{id __typename objectId}objectId value{__typename checked date number objectId text}}}}description{__typename text}due{__typename at reminder}isTemplate labels(first:-1){__typename edges{__typename node{id __typename color name objectId}}}lastActivityAt limits{__typename stickers{__typename perCard{__typename disableAt}}}list@optIn(to:"TrelloListBoard"){id __typename board{id __typename objectId}closed name objectId position softLimit}location{__typename address coordinates{__typename latitude longitude}name staticMapUrl}members(first:-1){__typename edges{__typename node{id __typename avatarUrl fullName initials nonPublicData{__typename avatarUrl fullName initials}objectId username}}}mirrorSourceId mirrorSourceNodeId name objectId pinned powerUpData{__typename edges{__typename node{id __typename objectId powerUp{__typename objectId}value}}}role shortId shortLink singleInstrumentationId stickers(first:-1){__typename edges{__typename node{__typename image imageScaled{__typename height objectId scaled url width}left objectId rotate top url zIndex}}}url}}}}}}}',
      variables: {
        id: ':idBoard',
      },
      operationName: 'TrelloBoardMirrorCards',
    },
  },
  MemberQuickBoards: {
    url: '/1/member/:idMember?fields=id&boards=open%2Cstarred&board_fields=id%2Cclosed%2CcreationMethod%2CdateLastActivity%2CdateLastView%2CdatePluginDisable%2CenterpriseOwned%2CidEnterprise%2CidOrganization%2Cname%2Cprefs%2CpremiumFeatures%2CshortLink%2CshortUrl%2Curl&boardStars=true',
    rootId: ':idMember',
    operationName: 'quickload:MemberQuickBoards',
    modelName: 'Member',
  },
  QuickBoardsSearch: {
    url: '/1/search?query=:searchTerm&partial=true&modelTypes=boards&board_fields=id%2Cclosed%2CcreationMethod%2CdateLastActivity%2CdateLastView%2CdatePluginDisable%2CenterpriseOwned%2CidEnterprise%2CidOrganization%2Cname%2Cprefs%2CpremiumFeatures%2CshortLink%2CshortUrl%2Curl',
    rootId: ':searchTerm',
    operationName: 'quickload:QuickBoardsSearch',
    modelName: 'Search',
  },
  PreloadCard: {
    url: '/1/card/:idCard?fields=id%2Cbadges%2CcardRole%2Cclosed%2Ccover%2CcreationMethod%2CcreationMethodError%2CcreationMethodLoadingStartedAt%2CdateClosed%2CdateLastActivity%2Cdesc%2CdescData%2Cdue%2CdueComplete%2CdueReminder%2Cemail%2CfaviconUrl%2CidAttachmentCover%2CidBoard%2CidChecklists%2CidLabels%2CidList%2CidMemberCreator%2CidMembers%2CidMembersVoted%2CidShort%2CisTemplate%2Clabels%2Climits%2CmanualCoverAttachment%2CmirrorSourceId%2Cname%2Cpinned%2Cpos%2CrecurrenceRule%2CshortLink%2CshortUrl%2CsingleInstrumentationId%2Cstart%2Csubscribed%2Curl%2CurlSource%2CurlSourceText&attachments=true&attachment_fields=id%2Cbytes%2Cdate%2CedgeColor%2CfileName%2CidMember%2CisMalicious%2CisUpload%2CmimeType%2Cname%2Cpos%2Cpreviews%2Curl&customFieldItems=true&pluginData=true&stickers=true&sticker_fields=id%2Cimage%2CimageScaled%2CimageUrl%2Cleft%2Crotate%2Ctop%2CzIndex',
    rootId: ':idCard',
    operationName: 'quickload:PreloadCard',
    modelName: 'Card',
  },
  OrganizationBillingPage: {
    url: '/1/organization/:idOrganization?fields=id%2Ccredits%2CdisplayName%2CidEnterprise%2Cmemberships%2Cname%2Coffering%2Cprefs%2Cproducts%2Ctype&enterprise=true&memberships=active',
    rootId: ':idOrganization',
    operationName: 'quickload:OrganizationBillingPage',
    modelName: 'Organization',
  },
  WorkspaceBoardsPageMinimal: {
    url: '/1/organization/:idOrganization?fields=id%2CbillableCollaboratorCount%2Ccredits%2Cdesc%2CdescData%2CdisplayName%2CidEnterprise%2Climits%2ClogoHash%2Cmemberships%2Cname%2Coffering%2Cprefs%2CpremiumFeatures%2Cproducts%2Ctype%2Cwebsite&boards=open&boards_count=29&board_fields=id%2Cclosed%2CcreationMethod%2CdateLastActivity%2CdatePluginDisable%2CenterpriseOwned%2CidEnterprise%2CidOrganization%2CidTags%2Cname%2Cprefs%2CpremiumFeatures%2CshortLink%2CshortUrl%2Curl&boards_sortBy=dateLastActivity&boards_sortOrder=desc&enterprise=true&memberships=active&paidAccount=true&paidAccount_fields=billingDates%2CcanRenew%2CcardLast4%2CcardType%2CcontactEmail%2CcontactFullName%2CcontactLocale%2Ccountry%2CdateFirstSubscription%2CexpirationDates%2CinvoiceDetails%2CisVatRegistered%2CixSubscriber%2CneedsCreditCardUpdate%2CpaidProduct%2CpreviousSubscription%2CproductOverride%2Cproducts%2CscheduledChange%2Cstanding%2CstateTaxId%2CtaxId%2CtrialExpiration%2CtrialType%2Czip&tags=true',
    rootId: ':idOrganization',
    operationName: 'quickload:WorkspaceBoardsPageMinimal',
    modelName: 'Organization',
  },
  WorkspaceHomePageMinimal: {
    url: '/1/organization/:idOrganization?fields=id%2CbillableCollaboratorCount%2Ccredits%2Cdesc%2CdescData%2CdisplayName%2CidEnterprise%2Climits%2ClogoHash%2Cmemberships%2Cname%2Coffering%2Cprefs%2CpremiumFeatures%2Cproducts%2Ctype%2Cwebsite&boards=open&boards_count=100&board_fields=id%2Cclosed%2CcreationMethod%2CdateLastActivity%2CdateLastView%2CdatePluginDisable%2CenterpriseOwned%2CidEnterprise%2CidOrganization%2CidTags%2Cname%2Cprefs%2CpremiumFeatures%2CshortLink%2CshortUrl%2Curl&boards_sortBy=dateLastActivity&boards_sortOrder=desc&board_membershipCounts=active&board_starCounts=organization&enterprise=true&members=all&member_fields=id%2ClastActive&memberships=active&paidAccount=true&paidAccount_fields=billingDates%2CcanRenew%2CcardLast4%2CcardType%2CcontactEmail%2CcontactFullName%2CcontactLocale%2Ccountry%2CdateFirstSubscription%2CexpirationDates%2CinvoiceDetails%2CisVatRegistered%2CixSubscriber%2CneedsCreditCardUpdate%2CpaidProduct%2CpreviousSubscription%2CproductOverride%2Cproducts%2CscheduledChange%2Cstanding%2CstateTaxId%2CtaxId%2CtrialExpiration%2CtrialType%2Czip&tags=true',
    rootId: ':idOrganization',
    operationName: 'quickload:WorkspaceHomePageMinimal',
    modelName: 'Organization',
  },
  MemberBoardsHome: {
    url: '/1/member/:idMember?fields=id&boards=open%2Cstarred&board_fields=id%2Cclosed%2CcreationMethod%2CdateLastActivity%2CdateLastView%2CdatePluginDisable%2CenterpriseOwned%2CidEnterprise%2CidOrganization%2Cname%2CnodeId%2Cprefs%2CpremiumFeatures%2CshortLink%2CshortUrl%2Csubscribed%2Curl&board_memberships=me&board_organization=true&board_organization_fields=id%2Ccredits%2CdisplayName%2CidEnterprise%2Climits%2ClogoHash%2Cname%2Coffering%2Cprefs%2CpremiumFeatures%2Cproducts&boardStars=true&organizations=all&organization_fields=id%2Ccredits%2Climits%2Cprefs%2CpremiumFeatures&organization_memberships=all',
    rootId: ':idMember',
    operationName: 'quickload:MemberBoardsHome',
    modelName: 'Member',
  },
};

export type QuickLoadOperations =
  | 'MemberHeader'
  | 'MemberBoards'
  | 'TrelloMemberBoards'
  | 'CurrentBoardInfo'
  | 'CurrentBoardListsCards'
  | 'TrelloCurrentBoardInfo'
  | 'TrelloCurrentBoardListsCards'
  | 'TrelloBoardMirrorCards'
  | 'MemberQuickBoards'
  | 'QuickBoardsSearch'
  | 'PreloadCard'
  | 'OrganizationBillingPage'
  | 'WorkspaceBoardsPageMinimal'
  | 'WorkspaceHomePageMinimal'
  | 'MemberBoardsHome';
