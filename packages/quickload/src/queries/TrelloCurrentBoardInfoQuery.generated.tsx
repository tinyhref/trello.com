import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloCurrentBoardInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrelloCurrentBoardInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloShortLink"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"boardByShortLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shortLink"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloBoard","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"creationMethod"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"display"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"cardFront"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"galleryInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"avatarShape"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"blurb"}},{"kind":"Field","name":{"kind":"Name","value":"byline"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"localizedDescription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"precedence"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"copyCount"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastActivityAt"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"totalMembersPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"openPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"openPerList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPerList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checkItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"perChecklist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checklists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFieldOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"perField"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"openPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"perAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uniquePerAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stickers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"perCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"membership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceMemberType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"activityBlocked"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"bioData"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublicData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}}]}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"powerUpData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"powerUp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"powerUps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"access"},"value":{"kind":"StringValue","value":"enabled","block":false}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"background"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"bottomColor"}},{"kind":"Field","name":{"kind":"Name","value":"brightness"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"imageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tile"}},{"kind":"Field","name":{"kind":"Name","value":"topColor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calendarFeedEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"canInvite"}},{"kind":"Field","name":{"kind":"Name","value":"cardAging"}},{"kind":"Field","name":{"kind":"Name","value":"cardCovers"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"hiddenPowerUpBoardButtons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hideVotes"}},{"kind":"Field","name":{"kind":"Name","value":"invitations"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}},{"kind":"Field","name":{"kind":"Name","value":"selfJoin"}},{"kind":"Field","name":{"kind":"Name","value":"showCompleteStatus"}},{"kind":"Field","name":{"kind":"Name","value":"switcherViews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"viewType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"voting"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"shortUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"calendarKey"}},{"kind":"Field","name":{"kind":"Name","value":"email"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenAt"}},{"kind":"Field","name":{"kind":"Name","value":"sidebar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"show"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"admins"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"freeBoards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"freeCollaborators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"membership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"associatedDomain"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentRestrictions"}},{"kind":"Field","name":{"kind":"Name","value":"boardDeleteRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"boardVisibilityRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"externalMembersDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"orgInviteRestrict"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"website"}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloCurrentBoardInfo","document":TrelloCurrentBoardInfoDocument}} as const;
export type TrelloCurrentBoardInfoQueryVariables = Types.Exact<{
  id: Types.Scalars['TrelloShortLink']['input'];
}>;


export type TrelloCurrentBoardInfoQuery = (
  { __typename: 'Query' }
  & { trello: (
    { __typename: 'TrelloQueryApi' }
    & { boardByShortLink?: Types.Maybe<(
      { __typename: 'TrelloBoard' }
      & Pick<
        Types.TrelloBoard,
        | 'id'
        | 'closed'
        | 'creationMethod'
        | 'enterpriseOwned'
        | 'lastActivityAt'
        | 'name'
        | 'objectId'
        | 'premiumFeatures'
        | 'shortLink'
        | 'shortUrl'
        | 'url'
      >
      & {
        creator?: Types.Maybe<(
          { __typename: 'TrelloMember' }
          & Pick<Types.TrelloMember, 'id' | 'objectId'>
        )>,
        customFields?: Types.Maybe<(
          { __typename: 'TrelloCustomFieldConnection' }
          & { edges?: Types.Maybe<Array<(
            { __typename: 'TrelloCustomFieldEdge' }
            & { node?: Types.Maybe<(
              { __typename: 'TrelloCustomField' }
              & Pick<
                Types.TrelloCustomField,
                | 'id'
                | 'name'
                | 'objectId'
                | 'position'
                | 'type'
              >
              & {
                display?: Types.Maybe<(
                  { __typename: 'TrelloCustomFieldDisplay' }
                  & Pick<Types.TrelloCustomFieldDisplay, 'cardFront'>
                )>,
                options?: Types.Maybe<Array<(
                  { __typename: 'TrelloCustomFieldOption' }
                  & Pick<Types.TrelloCustomFieldOption, 'color' | 'objectId' | 'position'>
                  & { value?: Types.Maybe<(
                    { __typename: 'TrelloCustomFieldOptionValue' }
                    & Pick<Types.TrelloCustomFieldOptionValue, 'text'>
                  )> }
                )>>,
              }
            )> }
          )>> }
        )>,
        description?: Types.Maybe<(
          { __typename: 'TrelloUserGeneratedText' }
          & Pick<Types.TrelloUserGeneratedText, 'text'>
        )>,
        enterprise?: Types.Maybe<(
          { __typename: 'TrelloEnterprise' }
          & Pick<Types.TrelloEnterprise, 'id' | 'displayName' | 'objectId'>
        )>,
        galleryInfo?: Types.Maybe<(
          { __typename: 'TrelloTemplateGalleryItemInfo' }
          & Pick<
            Types.TrelloTemplateGalleryItemInfo,
            | 'id'
            | 'avatarShape'
            | 'avatarUrl'
            | 'blurb'
            | 'byline'
            | 'featured'
            | 'precedence'
          >
          & {
            category: (
              { __typename: 'TrelloTemplateGalleryCategory' }
              & Pick<Types.TrelloTemplateGalleryCategory, 'key'>
            ),
            language: (
              { __typename: 'TrelloTemplateGalleryLanguage' }
              & Pick<
                Types.TrelloTemplateGalleryLanguage,
                | 'description'
                | 'enabled'
                | 'language'
                | 'locale'
                | 'localizedDescription'
              >
            ),
            stats?: Types.Maybe<(
              { __typename: 'TrelloTemplateGalleryItemStats' }
              & Pick<Types.TrelloTemplateGalleryItemStats, 'copyCount' | 'viewCount'>
            )>,
          }
        )>,
        labels?: Types.Maybe<(
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
        )>,
        limits?: Types.Maybe<(
          { __typename: 'TrelloBoardLimits' }
          & {
            attachments?: Types.Maybe<(
              { __typename: 'TrelloBoardAttachmentsLimits' }
              & {
                perBoard?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
                perCard?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
              }
            )>,
            boards?: Types.Maybe<(
              { __typename: 'TrelloBoardBoardsLimits' }
              & { totalMembersPerBoard?: Types.Maybe<(
                { __typename: 'TrelloLimitProps' }
                & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
              )> }
            )>,
            cards?: Types.Maybe<(
              { __typename: 'TrelloBoardCardsLimits' }
              & {
                openPerBoard?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
                openPerList?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
                totalPerBoard?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
                totalPerList?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
              }
            )>,
            checkItems?: Types.Maybe<(
              { __typename: 'TrelloBoardCheckItemsLimits' }
              & { perChecklist?: Types.Maybe<(
                { __typename: 'TrelloLimitProps' }
                & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
              )> }
            )>,
            checklists?: Types.Maybe<(
              { __typename: 'TrelloBoardChecklistsLimits' }
              & {
                perBoard?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
                perCard?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
              }
            )>,
            customFieldOptions?: Types.Maybe<(
              { __typename: 'TrelloBoardCustomFieldOptionsLimits' }
              & { perField?: Types.Maybe<(
                { __typename: 'TrelloLimitProps' }
                & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
              )> }
            )>,
            customFields?: Types.Maybe<(
              { __typename: 'TrelloBoardCustomFieldsLimits' }
              & { perBoard?: Types.Maybe<(
                { __typename: 'TrelloLimitProps' }
                & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
              )> }
            )>,
            labels?: Types.Maybe<(
              { __typename: 'TrelloBoardLabelsLimits' }
              & { perBoard?: Types.Maybe<(
                { __typename: 'TrelloLimitProps' }
                & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
              )> }
            )>,
            lists?: Types.Maybe<(
              { __typename: 'TrelloBoardListsLimits' }
              & {
                openPerBoard?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
                totalPerBoard?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
              }
            )>,
            reactions?: Types.Maybe<(
              { __typename: 'TrelloBoardReactionsLimits' }
              & {
                perAction?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
                uniquePerAction?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
              }
            )>,
            stickers?: Types.Maybe<(
              { __typename: 'TrelloBoardStickersLimits' }
              & { perCard?: Types.Maybe<(
                { __typename: 'TrelloLimitProps' }
                & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
              )> }
            )>,
          }
        )>,
        members?: Types.Maybe<(
          { __typename: 'TrelloBoardMembershipsConnection' }
          & { edges?: Types.Maybe<Array<(
            { __typename: 'TrelloBoardMembershipEdge' }
            & {
              membership?: Types.Maybe<(
                { __typename: 'TrelloBoardMembershipInfo' }
                & Pick<
                  Types.TrelloBoardMembershipInfo,
                  | 'deactivated'
                  | 'objectId'
                  | 'type'
                  | 'unconfirmed'
                  | 'workspaceMemberType'
                >
              )>,
              node?: Types.Maybe<(
                { __typename: 'TrelloMember' }
                & Pick<
                  Types.TrelloMember,
                  | 'id'
                  | 'activityBlocked'
                  | 'avatarUrl'
                  | 'bio'
                  | 'bioData'
                  | 'confirmed'
                  | 'fullName'
                  | 'initials'
                  | 'objectId'
                  | 'url'
                  | 'username'
                >
                & {
                  enterprise?: Types.Maybe<(
                    { __typename: 'TrelloEnterprise' }
                    & Pick<Types.TrelloEnterprise, 'id' | 'objectId'>
                  )>,
                  nonPublicData?: Types.Maybe<(
                    { __typename: 'TrelloMemberNonPublicData' }
                    & Pick<Types.TrelloMemberNonPublicData, 'avatarUrl' | 'fullName' | 'initials'>
                  )>,
                }
              )>,
            }
          )>> }
        )>,
        powerUpData?: Types.Maybe<(
          { __typename: 'TrelloPowerUpDataConnection' }
          & { edges?: Types.Maybe<Array<(
            { __typename: 'TrelloPowerUpDataEdge' }
            & { node: (
              { __typename: 'TrelloPowerUpData' }
              & Pick<
                Types.TrelloPowerUpData,
                | 'id'
                | 'access'
                | 'objectId'
                | 'scope'
                | 'value'
              >
              & { powerUp?: Types.Maybe<(
                { __typename: 'TrelloPowerUp' }
                & Pick<Types.TrelloPowerUp, 'objectId'>
              )> }
            ) }
          )>> }
        )>,
        powerUps?: Types.Maybe<(
          { __typename: 'TrelloBoardPowerUpConnection' }
          & { edges?: Types.Maybe<Array<(
            { __typename: 'TrelloBoardPowerUpEdge' }
            & Pick<Types.TrelloBoardPowerUpEdge, 'objectId'>
            & { node: (
              { __typename: 'TrelloPowerUp' }
              & Pick<Types.TrelloPowerUp, 'objectId'>
            ) }
          )>> }
        )>,
        prefs: (
          { __typename: 'TrelloBoardPrefs' }
          & Pick<
            Types.TrelloBoardPrefs,
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
            | 'showCompleteStatus'
            | 'voting'
          >
          & {
            background?: Types.Maybe<(
              { __typename: 'TrelloBoardBackground' }
              & Pick<
                Types.TrelloBoardBackground,
                | 'bottomColor'
                | 'brightness'
                | 'color'
                | 'image'
                | 'tile'
                | 'topColor'
              >
              & { imageScaled?: Types.Maybe<Array<(
                { __typename: 'TrelloScaleProps' }
                & Pick<Types.TrelloScaleProps, 'height' | 'url' | 'width'>
              )>> }
            )>,
            hiddenPowerUpBoardButtons?: Types.Maybe<Array<(
              { __typename: 'TrelloPowerUp' }
              & Pick<Types.TrelloPowerUp, 'objectId'>
            )>>,
            switcherViews?: Types.Maybe<Array<Types.Maybe<(
              { __typename: 'TrelloSwitcherViewsInfo' }
              & Pick<Types.TrelloSwitcherViewsInfo, 'enabled' | 'viewType'>
            )>>>,
          }
        ),
        tags?: Types.Maybe<(
          { __typename: 'TrelloTagConnection' }
          & { edges?: Types.Maybe<Array<(
            { __typename: 'TrelloTagEdge' }
            & { node?: Types.Maybe<(
              { __typename: 'TrelloTag' }
              & Pick<Types.TrelloTag, 'objectId'>
            )> }
          )>> }
        )>,
        viewer?: Types.Maybe<(
          { __typename: 'TrelloBoardViewer' }
          & Pick<Types.TrelloBoardViewer, 'calendarKey' | 'lastSeenAt' | 'subscribed'>
          & {
            email?: Types.Maybe<(
              { __typename: 'TrelloBoardViewerEmail' }
              & Pick<Types.TrelloBoardViewerEmail, 'key' | 'position'>
              & { list?: Types.Maybe<(
                { __typename: 'TrelloList' }
                & Pick<Types.TrelloList, 'id' | 'objectId'>
              )> }
            )>,
            sidebar?: Types.Maybe<(
              { __typename: 'TrelloBoardViewerSidebar' }
              & Pick<Types.TrelloBoardViewerSidebar, 'show'>
            )>,
          }
        )>,
        workspace?: Types.Maybe<(
          { __typename: 'TrelloWorkspace' }
          & Pick<
            Types.TrelloWorkspace,
            | 'id'
            | 'description'
            | 'displayName'
            | 'logoHash'
            | 'name'
            | 'objectId'
            | 'offering'
            | 'products'
            | 'url'
            | 'website'
          >
          & {
            enterprise?: Types.Maybe<(
              { __typename: 'TrelloEnterprise' }
              & Pick<Types.TrelloEnterprise, 'id' | 'displayName' | 'objectId'>
              & { admins?: Types.Maybe<(
                { __typename: 'TrelloMemberConnection' }
                & { edges?: Types.Maybe<Array<Types.Maybe<(
                  { __typename: 'TrelloMemberEdge' }
                  & { node?: Types.Maybe<(
                    { __typename: 'TrelloMember' }
                    & Pick<Types.TrelloMember, 'id'>
                  )> }
                )>>> }
              )> }
            )>,
            limits?: Types.Maybe<(
              { __typename: 'TrelloWorkspaceLimits' }
              & {
                freeBoards?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
                freeCollaborators?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
                totalMembers?: Types.Maybe<(
                  { __typename: 'TrelloLimitProps' }
                  & Pick<Types.TrelloLimitProps, 'disableAt' | 'status' | 'warnAt'>
                )>,
              }
            )>,
            members?: Types.Maybe<(
              { __typename: 'TrelloWorkspaceMembershipsConnection' }
              & { edges?: Types.Maybe<Array<(
                { __typename: 'TrelloWorkspaceMembershipEdge' }
                & {
                  membership?: Types.Maybe<(
                    { __typename: 'TrelloWorkspaceMembershipInfo' }
                    & Pick<
                      Types.TrelloWorkspaceMembershipInfo,
                      | 'deactivated'
                      | 'objectId'
                      | 'type'
                      | 'unconfirmed'
                    >
                  )>,
                  node?: Types.Maybe<(
                    { __typename: 'TrelloMember' }
                    & Pick<Types.TrelloMember, 'id' | 'objectId'>
                  )>,
                }
              )>> }
            )>,
            prefs?: Types.Maybe<(
              { __typename: 'TrelloWorkspacePrefs' }
              & Pick<
                Types.TrelloWorkspacePrefs,
                | 'associatedDomain'
                | 'attachmentRestrictions'
                | 'boardInviteRestrict'
                | 'externalMembersDisabled'
                | 'orgInviteRestrict'
                | 'permissionLevel'
              >
              & {
                boardDeleteRestrict?: Types.Maybe<(
                  { __typename: 'TrelloBoardRestrictions' }
                  & Pick<
                    Types.TrelloBoardRestrictions,
                    | 'enterprise'
                    | 'org'
                    | 'private'
                    | 'public'
                  >
                )>,
                boardVisibilityRestrict?: Types.Maybe<(
                  { __typename: 'TrelloBoardRestrictions' }
                  & Pick<
                    Types.TrelloBoardRestrictions,
                    | 'enterprise'
                    | 'org'
                    | 'private'
                    | 'public'
                  >
                )>,
              }
            )>,
            tags?: Types.Maybe<(
              { __typename: 'TrelloTagConnection' }
              & { edges?: Types.Maybe<Array<(
                { __typename: 'TrelloTagEdge' }
                & { node?: Types.Maybe<(
                  { __typename: 'TrelloTag' }
                  & Pick<Types.TrelloTag, 'name' | 'objectId'>
                )> }
              )>> }
            )>,
          }
        )>,
      }
    )> }
  ) }
);

/**
 * __useTrelloCurrentBoardInfoQuery__
 *
 * To run a query within a React component, call `useTrelloCurrentBoardInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrelloCurrentBoardInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloCurrentBoardInfoQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTrelloCurrentBoardInfoQuery(
  baseOptions: Apollo.QueryHookOptions<
    TrelloCurrentBoardInfoQuery,
    TrelloCurrentBoardInfoQueryVariables
  > &
    (
      | { variables: TrelloCurrentBoardInfoQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    TrelloCurrentBoardInfoQuery,
    TrelloCurrentBoardInfoQueryVariables
  >(TrelloCurrentBoardInfoDocument, options);
}
export function useTrelloCurrentBoardInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TrelloCurrentBoardInfoQuery,
    TrelloCurrentBoardInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    TrelloCurrentBoardInfoQuery,
    TrelloCurrentBoardInfoQueryVariables
  >(TrelloCurrentBoardInfoDocument, options);
}
export function useTrelloCurrentBoardInfoSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        TrelloCurrentBoardInfoQuery,
        TrelloCurrentBoardInfoQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    TrelloCurrentBoardInfoQuery,
    TrelloCurrentBoardInfoQueryVariables
  >(TrelloCurrentBoardInfoDocument, options);
}
export type TrelloCurrentBoardInfoQueryHookResult = ReturnType<
  typeof useTrelloCurrentBoardInfoQuery
>;
export type TrelloCurrentBoardInfoLazyQueryHookResult = ReturnType<
  typeof useTrelloCurrentBoardInfoLazyQuery
>;
export type TrelloCurrentBoardInfoSuspenseQueryHookResult = ReturnType<
  typeof useTrelloCurrentBoardInfoSuspenseQuery
>;
export type TrelloCurrentBoardInfoQueryResult = Apollo.QueryResult<
  TrelloCurrentBoardInfoQuery,
  TrelloCurrentBoardInfoQueryVariables
>;
