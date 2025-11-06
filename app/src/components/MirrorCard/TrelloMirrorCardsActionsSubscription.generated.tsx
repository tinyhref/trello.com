import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloMirrorCardsActionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrelloMirrorCardsActions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onBoardUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cardIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeIds"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloOnBoardUpdated","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"_deltas"}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionsFields"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"onActionDeleted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloCardActionsFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCardActions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloAddAttachmentToCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloAddAttachmentToCardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloAddChecklistToCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloAddChecklistToCardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloAddMemberToCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloAddMemberToCardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCommentCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCommentCardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCopyCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCopyCardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCopyCommentCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCopyCommentCardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCopyInboxCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCopyInboxCardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCreateCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCreateCardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCreateCardFromCheckItemAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCreateCardFromCheckItemActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCreateCardFromEmailAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCreateCardFromEmailActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCreateInboxCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCreateInboxCardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloDeleteAttachmentFromCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloDeleteAttachmentFromCardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloMoveCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloMoveCardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloMoveCardToBoardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloMoveCardToBoardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloMoveInboxCardToBoardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloMoveInboxCardToBoardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloRemoveChecklistFromCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloRemoveChecklistFromCardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloRemoveMemberFromCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloRemoveMemberFromCardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloUpdateCardClosedAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloUpdateCardClosedActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloUpdateCardCompleteAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloUpdateCardCompleteActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloUpdateCardDueAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloUpdateCardDueActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloUpdateCheckItemStateOnCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloUpdateCheckItemStateOnCardActionFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloUpdateCustomFieldItemAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloUpdateCustomFieldItemActionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloAddAttachmentToCardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloAddAttachmentToCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionAttachmentEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attachmentPreview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"originalUrl"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl2x"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloActionAttachmentEntityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloActionAttachmentEntity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloActionCardEntityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloActionCardEntity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloActionMemberEntity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloCardActionDataFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCardActionData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloCoreActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"appCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"displayKey"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"native"}},{"kind":"Field","name":{"kind":"Name","value":"shortName"}},{"kind":"Field","name":{"kind":"Name","value":"skinVariation"}},{"kind":"Field","name":{"kind":"Name","value":"unified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloAddChecklistToCardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloAddChecklistToCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"checklist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionChecklistEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloActionChecklistEntityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloActionChecklistEntity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloAddMemberToCardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloAddMemberToCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloCommentCardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCommentCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateLastEdited"}},{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCommentEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contextOn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contextId"}},{"kind":"Field","name":{"kind":"Name","value":"hideIfContext"}},{"kind":"Field","name":{"kind":"Name","value":"translationKey"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloActionCommentEntityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloActionCommentEntity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloCopyCardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCopyCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionListEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloActionListEntityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloActionListEntity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloCopyCommentCardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCopyCommentCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCommentEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalCommenter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloCopyInboxCardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCopyInboxCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloCreateCardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCreateCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionListEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloCreateCardFromCheckItemActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCreateCardFromCheckItemAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloCreateCardFromEmailActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCreateCardFromEmailAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionListEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloCreateInboxCardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCreateInboxCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloDeleteAttachmentFromCardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloDeleteAttachmentFromCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionAttachmentEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloMoveCardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloMoveCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"listAfter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionListEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"listBefore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionListEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloMoveCardToBoardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloMoveCardToBoardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionBoardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloActionBoardEntityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloActionBoardEntity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloMoveInboxCardToBoardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloMoveInboxCardToBoardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloRemoveChecklistFromCardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloRemoveChecklistFromCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"checklist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionChecklistEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloRemoveMemberFromCardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloRemoveMemberFromCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloUpdateCardClosedActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloUpdateCardClosedAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloUpdateCardCompleteActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloUpdateCardCompleteAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloUpdateCardDueActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloUpdateCardDueAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloUpdateCheckItemStateOnCardActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloUpdateCheckItemStateOnCardAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"checkItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloUpdateCustomFieldItemActionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloUpdateCustomFieldItemAction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionCardEntityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFieldItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloActionMemberEntityFields"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardActionDataFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCoreActionFields"}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloMirrorCardsActions","document":TrelloMirrorCardsActionsDocument}} as const;
export type TrelloMirrorCardsActionsSubscriptionVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
  nodeIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type TrelloMirrorCardsActionsSubscription = (
  { __typename: 'Subscription' }
  & { trello: (
    { __typename: 'TrelloSubscriptionApi' }
    & { onBoardUpdated?: Types.Maybe<(
      { __typename: 'TrelloBoardUpdated' }
      & Pick<Types.TrelloBoardUpdated, 'id' | '_deltas'>
      & { lists?: Types.Maybe<(
        { __typename: 'TrelloListUpdatedConnection' }
        & { edges?: Types.Maybe<Array<(
          { __typename: 'TrelloListEdgeUpdated' }
          & { node: (
            { __typename: 'TrelloListUpdated' }
            & Pick<Types.TrelloListUpdated, 'id'>
            & { cards?: Types.Maybe<(
              { __typename: 'TrelloCardUpdatedConnection' }
              & { edges?: Types.Maybe<Array<(
                { __typename: 'TrelloCardEdgeUpdated' }
                & { node:
                  | (
                    { __typename: 'TrelloCardUpdated' }
                    & Pick<Types.TrelloCardUpdated, 'id'>
                    & {
                      actions?: Types.Maybe<(
                        { __typename: 'TrelloCardActionConnectionUpdated' }
                        & { edges?: Types.Maybe<Array<(
                          { __typename: 'TrelloCardActionEdgeUpdated' }
                          & { node:
                            | (
                              { __typename: 'TrelloAddAttachmentToCardAction' }
                              & Pick<
                                Types.TrelloAddAttachmentToCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloAddAttachmentToCardActionDisplayEntities' }
                                  & {
                                    attachment?: Types.Maybe<(
                                      { __typename: 'TrelloActionAttachmentEntity' }
                                      & Pick<
                                        Types.TrelloActionAttachmentEntity,
                                        | 'link'
                                        | 'objectId'
                                        | 'text'
                                        | 'type'
                                        | 'url'
                                      >
                                    )>,
                                    attachmentPreview?: Types.Maybe<(
                                      { __typename: 'TrelloActionAttachmentPreviewEntity' }
                                      & Pick<
                                        Types.TrelloActionAttachmentPreviewEntity,
                                        | 'objectId'
                                        | 'originalUrl'
                                        | 'previewUrl'
                                        | 'previewUrl2x'
                                        | 'type'
                                      >
                                    )>,
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloAddChecklistToCardAction' }
                              & Pick<
                                Types.TrelloAddChecklistToCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloAddChecklistToCardDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    checklist?: Types.Maybe<(
                                      { __typename: 'TrelloActionChecklistEntity' }
                                      & Pick<Types.TrelloActionChecklistEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloAddMemberToCardAction' }
                              & Pick<
                                Types.TrelloAddMemberToCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloAddRemoveMemberActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCommentCardAction' }
                              & Pick<
                                Types.TrelloCommentCardAction,
                                | 'dateLastEdited'
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCommentCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    comment?: Types.Maybe<(
                                      { __typename: 'TrelloActionCommentEntity' }
                                      & Pick<Types.TrelloActionCommentEntity, 'text' | 'type'>
                                    )>,
                                    contextOn?: Types.Maybe<(
                                      { __typename: 'TrelloActionTranslatableEntity' }
                                      & Pick<
                                        Types.TrelloActionTranslatableEntity,
                                        | 'contextId'
                                        | 'hideIfContext'
                                        | 'translationKey'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCopyCardAction' }
                              & Pick<
                                Types.TrelloCopyCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCopyCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    cardSource?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    list?: Types.Maybe<(
                                      { __typename: 'TrelloActionListEntity' }
                                      & Pick<Types.TrelloActionListEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCopyCommentCardAction' }
                              & Pick<
                                Types.TrelloCopyCommentCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCopyCommentCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    comment?: Types.Maybe<(
                                      { __typename: 'TrelloActionCommentEntity' }
                                      & Pick<Types.TrelloActionCommentEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                    originalCommenter?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCopyInboxCardAction' }
                              & Pick<
                                Types.TrelloCopyInboxCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCopyInboxCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCreateCardAction' }
                              & Pick<
                                Types.TrelloCreateCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCreateCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    list?: Types.Maybe<(
                                      { __typename: 'TrelloActionListEntity' }
                                      & Pick<Types.TrelloActionListEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCreateCardFromCheckItemAction' }
                              & Pick<
                                Types.TrelloCreateCardFromCheckItemAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCreateCardFromCheckItemActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    cardSource?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCreateCardFromEmailAction' }
                              & Pick<
                                Types.TrelloCreateCardFromEmailAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCreateCardFromEmailActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    list?: Types.Maybe<(
                                      { __typename: 'TrelloActionListEntity' }
                                      & Pick<Types.TrelloActionListEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCreateInboxCardAction' }
                              & Pick<
                                Types.TrelloCreateInboxCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCreateInboxCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloDeleteAttachmentFromCardAction' }
                              & Pick<
                                Types.TrelloDeleteAttachmentFromCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloDeleteAttachmentFromCardActionDisplayEntities' }
                                  & {
                                    attachment?: Types.Maybe<(
                                      { __typename: 'TrelloActionAttachmentEntity' }
                                      & Pick<
                                        Types.TrelloActionAttachmentEntity,
                                        | 'link'
                                        | 'objectId'
                                        | 'text'
                                        | 'type'
                                        | 'url'
                                      >
                                    )>,
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloMoveCardAction' }
                              & Pick<
                                Types.TrelloMoveCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloMoveCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    listAfter?: Types.Maybe<(
                                      { __typename: 'TrelloActionListEntity' }
                                      & Pick<Types.TrelloActionListEntity, 'text' | 'type'>
                                    )>,
                                    listBefore?: Types.Maybe<(
                                      { __typename: 'TrelloActionListEntity' }
                                      & Pick<Types.TrelloActionListEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloMoveCardToBoardAction' }
                              & Pick<
                                Types.TrelloMoveCardToBoardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloMoveCardBoardEntities' }
                                  & {
                                    board?: Types.Maybe<(
                                      { __typename: 'TrelloActionBoardEntity' }
                                      & Pick<
                                        Types.TrelloActionBoardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloMoveInboxCardToBoardAction' }
                              & Pick<
                                Types.TrelloMoveInboxCardToBoardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloMoveInboxCardToBoardEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloRemoveChecklistFromCardAction' }
                              & Pick<
                                Types.TrelloRemoveChecklistFromCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloRemoveChecklistFromCardDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    checklist?: Types.Maybe<(
                                      { __typename: 'TrelloActionChecklistEntity' }
                                      & Pick<Types.TrelloActionChecklistEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloRemoveMemberFromCardAction' }
                              & Pick<
                                Types.TrelloRemoveMemberFromCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloAddRemoveMemberActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloUpdateCardClosedAction' }
                              & Pick<
                                Types.TrelloUpdateCardClosedAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloUpdateCardClosedActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloUpdateCardCompleteAction' }
                              & Pick<
                                Types.TrelloUpdateCardCompleteAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloUpdateCardCompleteActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloUpdateCardDueAction' }
                              & Pick<
                                Types.TrelloUpdateCardDueAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloUpdateCardDueActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    date?: Types.Maybe<(
                                      { __typename: 'TrelloActionDateEntity' }
                                      & Pick<Types.TrelloActionDateEntity, 'date' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | { __typename: 'TrelloUpdateCardRecurrenceRuleAction' }
                            | (
                              { __typename: 'TrelloUpdateCheckItemStateOnCardAction' }
                              & Pick<
                                Types.TrelloUpdateCheckItemStateOnCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloUpdateCheckItemStateOnCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    checkItem?: Types.Maybe<(
                                      { __typename: 'TrelloActionCheckItemEntity' }
                                      & Pick<Types.TrelloActionCheckItemEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloUpdateCustomFieldItemAction' }
                              & Pick<
                                Types.TrelloUpdateCustomFieldItemAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloUpdateCustomFieldItemActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    customFieldItem?: Types.Maybe<(
                                      { __typename: 'TrelloActionCustomFieldItemEntity' }
                                      & Pick<Types.TrelloActionCustomFieldItemEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                           }
                        )>> }
                      )>,
                      onActionDeleted?: Types.Maybe<Array<(
                        { __typename: 'TrelloActionDeleted' }
                        & Pick<Types.TrelloActionDeleted, 'id'>
                      )>>,
                    }
                  )
                  | (
                    { __typename: 'TrelloInboxCardUpdated' }
                    & Pick<Types.TrelloInboxCardUpdated, 'id'>
                    & {
                      actions?: Types.Maybe<(
                        { __typename: 'TrelloCardActionConnectionUpdated' }
                        & { edges?: Types.Maybe<Array<(
                          { __typename: 'TrelloCardActionEdgeUpdated' }
                          & { node:
                            | (
                              { __typename: 'TrelloAddAttachmentToCardAction' }
                              & Pick<
                                Types.TrelloAddAttachmentToCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloAddAttachmentToCardActionDisplayEntities' }
                                  & {
                                    attachment?: Types.Maybe<(
                                      { __typename: 'TrelloActionAttachmentEntity' }
                                      & Pick<
                                        Types.TrelloActionAttachmentEntity,
                                        | 'link'
                                        | 'objectId'
                                        | 'text'
                                        | 'type'
                                        | 'url'
                                      >
                                    )>,
                                    attachmentPreview?: Types.Maybe<(
                                      { __typename: 'TrelloActionAttachmentPreviewEntity' }
                                      & Pick<
                                        Types.TrelloActionAttachmentPreviewEntity,
                                        | 'objectId'
                                        | 'originalUrl'
                                        | 'previewUrl'
                                        | 'previewUrl2x'
                                        | 'type'
                                      >
                                    )>,
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloAddChecklistToCardAction' }
                              & Pick<
                                Types.TrelloAddChecklistToCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloAddChecklistToCardDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    checklist?: Types.Maybe<(
                                      { __typename: 'TrelloActionChecklistEntity' }
                                      & Pick<Types.TrelloActionChecklistEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloAddMemberToCardAction' }
                              & Pick<
                                Types.TrelloAddMemberToCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloAddRemoveMemberActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCommentCardAction' }
                              & Pick<
                                Types.TrelloCommentCardAction,
                                | 'dateLastEdited'
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCommentCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    comment?: Types.Maybe<(
                                      { __typename: 'TrelloActionCommentEntity' }
                                      & Pick<Types.TrelloActionCommentEntity, 'text' | 'type'>
                                    )>,
                                    contextOn?: Types.Maybe<(
                                      { __typename: 'TrelloActionTranslatableEntity' }
                                      & Pick<
                                        Types.TrelloActionTranslatableEntity,
                                        | 'contextId'
                                        | 'hideIfContext'
                                        | 'translationKey'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCopyCardAction' }
                              & Pick<
                                Types.TrelloCopyCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCopyCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    cardSource?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    list?: Types.Maybe<(
                                      { __typename: 'TrelloActionListEntity' }
                                      & Pick<Types.TrelloActionListEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCopyCommentCardAction' }
                              & Pick<
                                Types.TrelloCopyCommentCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCopyCommentCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    comment?: Types.Maybe<(
                                      { __typename: 'TrelloActionCommentEntity' }
                                      & Pick<Types.TrelloActionCommentEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                    originalCommenter?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCopyInboxCardAction' }
                              & Pick<
                                Types.TrelloCopyInboxCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCopyInboxCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCreateCardAction' }
                              & Pick<
                                Types.TrelloCreateCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCreateCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    list?: Types.Maybe<(
                                      { __typename: 'TrelloActionListEntity' }
                                      & Pick<Types.TrelloActionListEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCreateCardFromCheckItemAction' }
                              & Pick<
                                Types.TrelloCreateCardFromCheckItemAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCreateCardFromCheckItemActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    cardSource?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCreateCardFromEmailAction' }
                              & Pick<
                                Types.TrelloCreateCardFromEmailAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCreateCardFromEmailActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    list?: Types.Maybe<(
                                      { __typename: 'TrelloActionListEntity' }
                                      & Pick<Types.TrelloActionListEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloCreateInboxCardAction' }
                              & Pick<
                                Types.TrelloCreateInboxCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloCreateInboxCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloDeleteAttachmentFromCardAction' }
                              & Pick<
                                Types.TrelloDeleteAttachmentFromCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloDeleteAttachmentFromCardActionDisplayEntities' }
                                  & {
                                    attachment?: Types.Maybe<(
                                      { __typename: 'TrelloActionAttachmentEntity' }
                                      & Pick<
                                        Types.TrelloActionAttachmentEntity,
                                        | 'link'
                                        | 'objectId'
                                        | 'text'
                                        | 'type'
                                        | 'url'
                                      >
                                    )>,
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloMoveCardAction' }
                              & Pick<
                                Types.TrelloMoveCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloMoveCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    listAfter?: Types.Maybe<(
                                      { __typename: 'TrelloActionListEntity' }
                                      & Pick<Types.TrelloActionListEntity, 'text' | 'type'>
                                    )>,
                                    listBefore?: Types.Maybe<(
                                      { __typename: 'TrelloActionListEntity' }
                                      & Pick<Types.TrelloActionListEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloMoveCardToBoardAction' }
                              & Pick<
                                Types.TrelloMoveCardToBoardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloMoveCardBoardEntities' }
                                  & {
                                    board?: Types.Maybe<(
                                      { __typename: 'TrelloActionBoardEntity' }
                                      & Pick<
                                        Types.TrelloActionBoardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloMoveInboxCardToBoardAction' }
                              & Pick<
                                Types.TrelloMoveInboxCardToBoardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloMoveInboxCardToBoardEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloRemoveChecklistFromCardAction' }
                              & Pick<
                                Types.TrelloRemoveChecklistFromCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloRemoveChecklistFromCardDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    checklist?: Types.Maybe<(
                                      { __typename: 'TrelloActionChecklistEntity' }
                                      & Pick<Types.TrelloActionChecklistEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloRemoveMemberFromCardAction' }
                              & Pick<
                                Types.TrelloRemoveMemberFromCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloAddRemoveMemberActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloUpdateCardClosedAction' }
                              & Pick<
                                Types.TrelloUpdateCardClosedAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloUpdateCardClosedActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloUpdateCardCompleteAction' }
                              & Pick<
                                Types.TrelloUpdateCardCompleteAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloUpdateCardCompleteActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloUpdateCardDueAction' }
                              & Pick<
                                Types.TrelloUpdateCardDueAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloUpdateCardDueActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    date?: Types.Maybe<(
                                      { __typename: 'TrelloActionDateEntity' }
                                      & Pick<Types.TrelloActionDateEntity, 'date' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | { __typename: 'TrelloUpdateCardRecurrenceRuleAction' }
                            | (
                              { __typename: 'TrelloUpdateCheckItemStateOnCardAction' }
                              & Pick<
                                Types.TrelloUpdateCheckItemStateOnCardAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloUpdateCheckItemStateOnCardActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    checkItem?: Types.Maybe<(
                                      { __typename: 'TrelloActionCheckItemEntity' }
                                      & Pick<Types.TrelloActionCheckItemEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                            | (
                              { __typename: 'TrelloUpdateCustomFieldItemAction' }
                              & Pick<
                                Types.TrelloUpdateCustomFieldItemAction,
                                | 'id'
                                | 'date'
                                | 'displayKey'
                                | 'type'
                              >
                              & {
                                displayEntities?: Types.Maybe<(
                                  { __typename: 'TrelloUpdateCustomFieldItemActionDisplayEntities' }
                                  & {
                                    card?: Types.Maybe<(
                                      { __typename: 'TrelloActionCardEntity' }
                                      & Pick<
                                        Types.TrelloActionCardEntity,
                                        | 'objectId'
                                        | 'shortLink'
                                        | 'text'
                                        | 'type'
                                      >
                                    )>,
                                    customFieldItem?: Types.Maybe<(
                                      { __typename: 'TrelloActionCustomFieldItemEntity' }
                                      & Pick<Types.TrelloActionCustomFieldItemEntity, 'text' | 'type'>
                                    )>,
                                    memberCreator?: Types.Maybe<(
                                      { __typename: 'TrelloActionMemberEntity' }
                                      & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
                                    )>,
                                  }
                                )>,
                                card?: Types.Maybe<(
                                  { __typename: 'TrelloCard' }
                                  & Pick<Types.TrelloCard, 'id'>
                                )>,
                                appCreator?: Types.Maybe<(
                                  { __typename: 'TrelloAppCreator' }
                                  & Pick<Types.TrelloAppCreator, 'id' | 'name'>
                                )>,
                                creator?: Types.Maybe<(
                                  { __typename: 'TrelloMember' }
                                  & Pick<Types.TrelloMember, 'id'>
                                )>,
                                reactions?: Types.Maybe<Array<(
                                  { __typename: 'TrelloReaction' }
                                  & Pick<Types.TrelloReaction, 'objectId'>
                                  & {
                                    emoji?: Types.Maybe<(
                                      { __typename: 'TrelloEmoji' }
                                      & Pick<
                                        Types.TrelloEmoji,
                                        | 'name'
                                        | 'native'
                                        | 'shortName'
                                        | 'skinVariation'
                                        | 'unified'
                                      >
                                    )>,
                                    member?: Types.Maybe<(
                                      { __typename: 'TrelloMember' }
                                      & Pick<Types.TrelloMember, 'id' | 'objectId'>
                                    )>,
                                  }
                                )>>,
                              }
                            )
                           }
                        )>> }
                      )>,
                      onActionDeleted?: Types.Maybe<Array<(
                        { __typename: 'TrelloActionDeleted' }
                        & Pick<Types.TrelloActionDeleted, 'id'>
                      )>>,
                    }
                  )
                 }
              )>> }
            )> }
          ) }
        )>> }
      )> }
    )> }
  ) }
);

/**
 * __useTrelloMirrorCardsActionsSubscription__
 *
 * To run a query within a React component, call `useTrelloMirrorCardsActionsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTrelloMirrorCardsActionsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloMirrorCardsActionsSubscription({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      nodeIds: // value for 'nodeIds'
 *   },
 * });
 */
export function useTrelloMirrorCardsActionsSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    TrelloMirrorCardsActionsSubscription,
    TrelloMirrorCardsActionsSubscriptionVariables
  > &
    (
      | {
          variables: TrelloMirrorCardsActionsSubscriptionVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    TrelloMirrorCardsActionsSubscription,
    TrelloMirrorCardsActionsSubscriptionVariables
  >(TrelloMirrorCardsActionsDocument, options);
}
export type TrelloMirrorCardsActionsSubscriptionHookResult = ReturnType<
  typeof useTrelloMirrorCardsActionsSubscription
>;
export type TrelloMirrorCardsActionsSubscriptionResult =
  Apollo.SubscriptionResult<TrelloMirrorCardsActionsSubscription>;
