import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloMirrorCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrelloMirrorCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onBoardUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cardIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeIds"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloOnBoardUpdated","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"_deltas"}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"display"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardFront"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bytes"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"edgeColor"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"isMalicious"}},{"kind":"Field","name":{"kind":"Name","value":"isUpload"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"previews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bytes"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloAllCardBadges"}}]}},{"kind":"Field","name":{"kind":"Name","value":"checklists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"due"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"at"}},{"kind":"Field","name":{"kind":"Name","value":"reminder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"complete"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brightness"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"edgeColor"}},{"kind":"Field","name":{"kind":"Name","value":"powerUp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bytes"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"sharedSourceUrl"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedBackground"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"due"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"at"}},{"kind":"Field","name":{"kind":"Name","value":"reminder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastActivityAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"onChecklistDeleted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCardUpdated"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloMirrorCardSubscriptionCard"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"onCardDeleted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"onCustomFieldDeleted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onLabelDeleted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"powerUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloAllCardBadges"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCardBadges"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachments"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentsByType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"}},{"kind":"Field","name":{"kind":"Name","value":"card"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checkItems"}},{"kind":"Field","name":{"kind":"Name","value":"checkItemsChecked"}},{"kind":"Field","name":{"kind":"Name","value":"checkItemsEarliestDue"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"due"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"at"}},{"kind":"Field","name":{"kind":"Name","value":"complete"}}]}},{"kind":"Field","name":{"kind":"Name","value":"externalSource"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdatedByAi"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"maliciousAttachments"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"voted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"votes"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloMirrorCardSubscriptionCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCardUpdated"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bytes"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"edgeColor"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"isMalicious"}},{"kind":"Field","name":{"kind":"Name","value":"isUpload"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"previews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bytes"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloAllCardBadges"}}]}},{"kind":"Field","name":{"kind":"Name","value":"checklists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"due"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"at"}},{"kind":"Field","name":{"kind":"Name","value":"reminder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"complete"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brightness"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"edgeColor"}},{"kind":"Field","name":{"kind":"Name","value":"powerUp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bytes"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"sharedSourceUrl"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedBackground"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFieldItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customField"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checked"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"due"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"at"}},{"kind":"Field","name":{"kind":"Name","value":"reminder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastActivityAt"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"staticMapUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublicData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"membersVoted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"onChecklistDeleted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"stickers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"imageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"left"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"rotate"}},{"kind":"Field","name":{"kind":"Name","value":"top"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloMirrorCards","document":TrelloMirrorCardsDocument}} as const;
export type TrelloMirrorCardsSubscriptionVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
  nodeIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type TrelloMirrorCardsSubscription = (
  { __typename: 'Subscription' }
  & { trello: (
    { __typename: 'TrelloSubscriptionApi' }
    & { onBoardUpdated?: Types.Maybe<(
      { __typename: 'TrelloBoardUpdated' }
      & Pick<
        Types.TrelloBoardUpdated,
        | 'id'
        | '_deltas'
        | 'name'
        | 'objectId'
      >
      & {
        customFields?: Types.Maybe<(
          { __typename: 'TrelloCustomFieldConnectionUpdated' }
          & { edges?: Types.Maybe<Array<(
            { __typename: 'TrelloCustomFieldEdgeUpdated' }
            & { node: (
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
            ) }
          )>> }
        )>,
        labels?: Types.Maybe<(
          { __typename: 'TrelloLabelConnectionUpdated' }
          & { edges?: Types.Maybe<Array<(
            { __typename: 'TrelloLabelEdgeUpdated' }
            & { node: (
              { __typename: 'TrelloLabelUpdated' }
              & Pick<
                Types.TrelloLabelUpdated,
                | 'id'
                | 'color'
                | 'name'
                | 'objectId'
              >
            ) }
          )>> }
        )>,
        lists?: Types.Maybe<(
          { __typename: 'TrelloListUpdatedConnection' }
          & { edges?: Types.Maybe<Array<(
            { __typename: 'TrelloListEdgeUpdated' }
            & { node: (
              { __typename: 'TrelloListUpdated' }
              & Pick<
                Types.TrelloListUpdated,
                | 'id'
                | 'color'
                | 'name'
                | 'objectId'
                | 'position'
              >
              & {
                cards?: Types.Maybe<(
                  { __typename: 'TrelloCardUpdatedConnection' }
                  & { edges?: Types.Maybe<Array<(
                    { __typename: 'TrelloCardEdgeUpdated' }
                    & { node:
                      | (
                        { __typename: 'TrelloCardUpdated' }
                        & Pick<
                          Types.TrelloCardUpdated,
                          | 'id'
                          | 'closed'
                          | 'complete'
                          | 'lastActivityAt'
                          | 'name'
                          | 'objectId'
                          | 'position'
                          | 'startedAt'
                        >
                        & {
                          attachments?: Types.Maybe<(
                            { __typename: 'TrelloAttachmentConnectionUpdated' }
                            & { edges?: Types.Maybe<Array<(
                              { __typename: 'TrelloAttachmentEdgeUpdated' }
                              & { node: (
                                { __typename: 'TrelloAttachment' }
                                & Pick<
                                  Types.TrelloAttachment,
                                  | 'id'
                                  | 'bytes'
                                  | 'creatorId'
                                  | 'date'
                                  | 'edgeColor'
                                  | 'fileName'
                                  | 'isMalicious'
                                  | 'isUpload'
                                  | 'mimeType'
                                  | 'name'
                                  | 'objectId'
                                  | 'position'
                                  | 'url'
                                >
                                & { previews?: Types.Maybe<(
                                  { __typename: 'TrelloImagePreviewConnection' }
                                  & { edges?: Types.Maybe<Array<(
                                    { __typename: 'TrelloImagePreviewEdge' }
                                    & { node: (
                                      { __typename: 'TrelloImagePreview' }
                                      & Pick<
                                        Types.TrelloImagePreview,
                                        | 'bytes'
                                        | 'height'
                                        | 'objectId'
                                        | 'scaled'
                                        | 'url'
                                        | 'width'
                                      >
                                    ) }
                                  )>> }
                                )> }
                              ) }
                            )>> }
                          )>,
                          badges?: Types.Maybe<(
                            { __typename: 'TrelloCardBadges' }
                            & Pick<
                              Types.TrelloCardBadges,
                              | 'attachments'
                              | 'checkItems'
                              | 'checkItemsChecked'
                              | 'checkItemsEarliestDue'
                              | 'comments'
                              | 'description'
                              | 'externalSource'
                              | 'lastUpdatedByAi'
                              | 'location'
                              | 'maliciousAttachments'
                              | 'startedAt'
                              | 'votes'
                            >
                            & {
                              attachmentsByType?: Types.Maybe<(
                                { __typename: 'TrelloCardAttachmentsByType' }
                                & { trello?: Types.Maybe<(
                                  { __typename: 'TrelloCardAttachmentsCount' }
                                  & Pick<Types.TrelloCardAttachmentsCount, 'board' | 'card'>
                                )> }
                              )>,
                              due?: Types.Maybe<(
                                { __typename: 'TrelloCardBadgeDueInfo' }
                                & Pick<Types.TrelloCardBadgeDueInfo, 'at' | 'complete'>
                              )>,
                              viewer?: Types.Maybe<(
                                { __typename: 'TrelloCardViewer' }
                                & Pick<Types.TrelloCardViewer, 'subscribed' | 'voted'>
                              )>,
                            }
                          )>,
                          checklists?: Types.Maybe<(
                            { __typename: 'TrelloChecklistConnectionUpdated' }
                            & { edges?: Types.Maybe<Array<(
                              { __typename: 'TrelloChecklistEdgeUpdated' }
                              & { node: (
                                { __typename: 'TrelloChecklistUpdated' }
                                & Pick<
                                  Types.TrelloChecklistUpdated,
                                  | 'id'
                                  | 'name'
                                  | 'objectId'
                                  | 'position'
                                >
                                & { checkItems?: Types.Maybe<(
                                  { __typename: 'TrelloCheckItemConnectionUpdated' }
                                  & { edges?: Types.Maybe<Array<(
                                    { __typename: 'TrelloCheckItemEdgeUpdated' }
                                    & { node: (
                                      { __typename: 'TrelloCheckItem' }
                                      & Pick<
                                        Types.TrelloCheckItem,
                                        | 'id'
                                        | 'objectId'
                                        | 'position'
                                        | 'state'
                                      >
                                      & {
                                        due?: Types.Maybe<(
                                          { __typename: 'TrelloCheckItemDueInfo' }
                                          & Pick<Types.TrelloCheckItemDueInfo, 'at' | 'reminder'>
                                        )>,
                                        member?: Types.Maybe<(
                                          { __typename: 'TrelloMember' }
                                          & Pick<Types.TrelloMember, 'id'>
                                        )>,
                                        name?: Types.Maybe<(
                                          { __typename: 'TrelloUserGeneratedText' }
                                          & Pick<Types.TrelloUserGeneratedText, 'text'>
                                        )>,
                                      }
                                    ) }
                                  )>> }
                                )> }
                              ) }
                            )>> }
                          )>,
                          cover?: Types.Maybe<(
                            { __typename: 'TrelloCardCoverUpdated' }
                            & Pick<
                              Types.TrelloCardCoverUpdated,
                              | 'brightness'
                              | 'color'
                              | 'edgeColor'
                              | 'sharedSourceUrl'
                              | 'size'
                            >
                            & {
                              attachment?: Types.Maybe<(
                                { __typename: 'TrelloAttachmentUpdated' }
                                & Pick<Types.TrelloAttachmentUpdated, 'id'>
                              )>,
                              powerUp?: Types.Maybe<(
                                { __typename: 'TrelloPowerUpUpdated' }
                                & Pick<Types.TrelloPowerUpUpdated, 'objectId'>
                              )>,
                              previews?: Types.Maybe<(
                                { __typename: 'TrelloImagePreviewUpdatedConnection' }
                                & { edges?: Types.Maybe<Array<(
                                  { __typename: 'TrelloImagePreviewEdgeUpdated' }
                                  & { node: (
                                    { __typename: 'TrelloImagePreview' }
                                    & Pick<
                                      Types.TrelloImagePreview,
                                      | 'bytes'
                                      | 'height'
                                      | 'objectId'
                                      | 'scaled'
                                      | 'url'
                                      | 'width'
                                    >
                                  ) }
                                )>> }
                              )>,
                              uploadedBackground?: Types.Maybe<(
                                { __typename: 'TrelloUploadedBackground' }
                                & Pick<Types.TrelloUploadedBackground, 'objectId'>
                              )>,
                            }
                          )>,
                          description?: Types.Maybe<(
                            { __typename: 'TrelloUserGeneratedText' }
                            & Pick<Types.TrelloUserGeneratedText, 'text'>
                          )>,
                          due?: Types.Maybe<(
                            { __typename: 'TrelloCardDueInfo' }
                            & Pick<Types.TrelloCardDueInfo, 'at' | 'reminder'>
                          )>,
                          onChecklistDeleted?: Types.Maybe<Array<(
                            { __typename: 'TrelloChecklistDeleted' }
                            & Pick<Types.TrelloChecklistDeleted, 'id'>
                          )>>,
                          customFieldItems?: Types.Maybe<(
                            { __typename: 'TrelloCustomFieldItemUpdatedConnection' }
                            & { edges?: Types.Maybe<Array<(
                              { __typename: 'TrelloCardCustomFieldItemEdgeUpdated' }
                              & { node: (
                                { __typename: 'TrelloCustomFieldItemUpdated' }
                                & Pick<Types.TrelloCustomFieldItemUpdated, 'objectId'>
                                & {
                                  customField?: Types.Maybe<(
                                    { __typename: 'TrelloCustomFieldId' }
                                    & Pick<Types.TrelloCustomFieldId, 'id'>
                                  )>,
                                  value?: Types.Maybe<(
                                    { __typename: 'TrelloCustomFieldItemValueInfo' }
                                    & Pick<
                                      Types.TrelloCustomFieldItemValueInfo,
                                      | 'checked'
                                      | 'date'
                                      | 'number'
                                      | 'objectId'
                                      | 'text'
                                    >
                                  )>,
                                }
                              ) }
                            )>> }
                          )>,
                          labels?: Types.Maybe<(
                            { __typename: 'TrelloLabelUpdatedConnection' }
                            & { edges?: Types.Maybe<Array<(
                              { __typename: 'TrelloCardLabelEdgeUpdated' }
                              & { node: (
                                { __typename: 'TrelloLabelId' }
                                & Pick<Types.TrelloLabelId, 'id'>
                              ) }
                            )>> }
                          )>,
                          location?: Types.Maybe<(
                            { __typename: 'TrelloCardLocation' }
                            & Pick<Types.TrelloCardLocation, 'address' | 'name' | 'staticMapUrl'>
                            & { coordinates?: Types.Maybe<(
                              { __typename: 'TrelloCardCoordinates' }
                              & Pick<Types.TrelloCardCoordinates, 'latitude' | 'longitude'>
                            )> }
                          )>,
                          members?: Types.Maybe<(
                            { __typename: 'TrelloMemberUpdatedConnection' }
                            & { edges?: Types.Maybe<Array<(
                              { __typename: 'TrelloCardMemberEdgeUpdated' }
                              & { node?: Types.Maybe<(
                                { __typename: 'TrelloMember' }
                                & Pick<
                                  Types.TrelloMember,
                                  | 'id'
                                  | 'avatarUrl'
                                  | 'fullName'
                                  | 'initials'
                                  | 'username'
                                >
                                & { nonPublicData?: Types.Maybe<(
                                  { __typename: 'TrelloMemberNonPublicData' }
                                  & Pick<Types.TrelloMemberNonPublicData, 'avatarUrl' | 'fullName' | 'initials'>
                                )> }
                              )> }
                            )>> }
                          )>,
                          membersVoted?: Types.Maybe<(
                            { __typename: 'TrelloMemberUpdatedConnection' }
                            & { edges?: Types.Maybe<Array<(
                              { __typename: 'TrelloCardMemberEdgeUpdated' }
                              & { node?: Types.Maybe<(
                                { __typename: 'TrelloMember' }
                                & Pick<
                                  Types.TrelloMember,
                                  | 'id'
                                  | 'avatarUrl'
                                  | 'fullName'
                                  | 'initials'
                                  | 'username'
                                >
                              )> }
                            )>> }
                          )>,
                          stickers?: Types.Maybe<(
                            { __typename: 'TrelloStickerUpdatedConnection' }
                            & { edges?: Types.Maybe<Array<(
                              { __typename: 'TrelloStickerEdge' }
                              & { node: (
                                { __typename: 'TrelloSticker' }
                                & Pick<
                                  Types.TrelloSticker,
                                  | 'image'
                                  | 'left'
                                  | 'objectId'
                                  | 'rotate'
                                  | 'top'
                                  | 'url'
                                  | 'zIndex'
                                >
                                & { imageScaled?: Types.Maybe<Array<(
                                  { __typename: 'TrelloImagePreview' }
                                  & Pick<
                                    Types.TrelloImagePreview,
                                    | 'height'
                                    | 'objectId'
                                    | 'scaled'
                                    | 'url'
                                    | 'width'
                                  >
                                )>> }
                              ) }
                            )>> }
                          )>,
                        }
                      )
                      | (
                        { __typename: 'TrelloInboxCardUpdated' }
                        & Pick<
                          Types.TrelloInboxCardUpdated,
                          | 'id'
                          | 'closed'
                          | 'complete'
                          | 'lastActivityAt'
                          | 'name'
                          | 'objectId'
                          | 'position'
                          | 'startedAt'
                        >
                        & {
                          attachments?: Types.Maybe<(
                            { __typename: 'TrelloAttachmentConnectionUpdated' }
                            & { edges?: Types.Maybe<Array<(
                              { __typename: 'TrelloAttachmentEdgeUpdated' }
                              & { node: (
                                { __typename: 'TrelloAttachment' }
                                & Pick<
                                  Types.TrelloAttachment,
                                  | 'id'
                                  | 'bytes'
                                  | 'creatorId'
                                  | 'date'
                                  | 'edgeColor'
                                  | 'fileName'
                                  | 'isMalicious'
                                  | 'isUpload'
                                  | 'mimeType'
                                  | 'name'
                                  | 'objectId'
                                  | 'position'
                                  | 'url'
                                >
                                & { previews?: Types.Maybe<(
                                  { __typename: 'TrelloImagePreviewConnection' }
                                  & { edges?: Types.Maybe<Array<(
                                    { __typename: 'TrelloImagePreviewEdge' }
                                    & { node: (
                                      { __typename: 'TrelloImagePreview' }
                                      & Pick<
                                        Types.TrelloImagePreview,
                                        | 'bytes'
                                        | 'height'
                                        | 'objectId'
                                        | 'scaled'
                                        | 'url'
                                        | 'width'
                                      >
                                    ) }
                                  )>> }
                                )> }
                              ) }
                            )>> }
                          )>,
                          badges?: Types.Maybe<(
                            { __typename: 'TrelloCardBadges' }
                            & Pick<
                              Types.TrelloCardBadges,
                              | 'attachments'
                              | 'checkItems'
                              | 'checkItemsChecked'
                              | 'checkItemsEarliestDue'
                              | 'comments'
                              | 'description'
                              | 'externalSource'
                              | 'lastUpdatedByAi'
                              | 'location'
                              | 'maliciousAttachments'
                              | 'startedAt'
                              | 'votes'
                            >
                            & {
                              attachmentsByType?: Types.Maybe<(
                                { __typename: 'TrelloCardAttachmentsByType' }
                                & { trello?: Types.Maybe<(
                                  { __typename: 'TrelloCardAttachmentsCount' }
                                  & Pick<Types.TrelloCardAttachmentsCount, 'board' | 'card'>
                                )> }
                              )>,
                              due?: Types.Maybe<(
                                { __typename: 'TrelloCardBadgeDueInfo' }
                                & Pick<Types.TrelloCardBadgeDueInfo, 'at' | 'complete'>
                              )>,
                              viewer?: Types.Maybe<(
                                { __typename: 'TrelloCardViewer' }
                                & Pick<Types.TrelloCardViewer, 'subscribed' | 'voted'>
                              )>,
                            }
                          )>,
                          checklists?: Types.Maybe<(
                            { __typename: 'TrelloChecklistConnectionUpdated' }
                            & { edges?: Types.Maybe<Array<(
                              { __typename: 'TrelloChecklistEdgeUpdated' }
                              & { node: (
                                { __typename: 'TrelloChecklistUpdated' }
                                & Pick<
                                  Types.TrelloChecklistUpdated,
                                  | 'id'
                                  | 'name'
                                  | 'objectId'
                                  | 'position'
                                >
                                & { checkItems?: Types.Maybe<(
                                  { __typename: 'TrelloCheckItemConnectionUpdated' }
                                  & { edges?: Types.Maybe<Array<(
                                    { __typename: 'TrelloCheckItemEdgeUpdated' }
                                    & { node: (
                                      { __typename: 'TrelloCheckItem' }
                                      & Pick<
                                        Types.TrelloCheckItem,
                                        | 'id'
                                        | 'objectId'
                                        | 'position'
                                        | 'state'
                                      >
                                      & {
                                        due?: Types.Maybe<(
                                          { __typename: 'TrelloCheckItemDueInfo' }
                                          & Pick<Types.TrelloCheckItemDueInfo, 'at' | 'reminder'>
                                        )>,
                                        member?: Types.Maybe<(
                                          { __typename: 'TrelloMember' }
                                          & Pick<Types.TrelloMember, 'id'>
                                        )>,
                                        name?: Types.Maybe<(
                                          { __typename: 'TrelloUserGeneratedText' }
                                          & Pick<Types.TrelloUserGeneratedText, 'text'>
                                        )>,
                                      }
                                    ) }
                                  )>> }
                                )> }
                              ) }
                            )>> }
                          )>,
                          cover?: Types.Maybe<(
                            { __typename: 'TrelloCardCoverUpdated' }
                            & Pick<
                              Types.TrelloCardCoverUpdated,
                              | 'brightness'
                              | 'color'
                              | 'edgeColor'
                              | 'sharedSourceUrl'
                              | 'size'
                            >
                            & {
                              attachment?: Types.Maybe<(
                                { __typename: 'TrelloAttachmentUpdated' }
                                & Pick<Types.TrelloAttachmentUpdated, 'id'>
                              )>,
                              powerUp?: Types.Maybe<(
                                { __typename: 'TrelloPowerUpUpdated' }
                                & Pick<Types.TrelloPowerUpUpdated, 'objectId'>
                              )>,
                              previews?: Types.Maybe<(
                                { __typename: 'TrelloImagePreviewUpdatedConnection' }
                                & { edges?: Types.Maybe<Array<(
                                  { __typename: 'TrelloImagePreviewEdgeUpdated' }
                                  & { node: (
                                    { __typename: 'TrelloImagePreview' }
                                    & Pick<
                                      Types.TrelloImagePreview,
                                      | 'bytes'
                                      | 'height'
                                      | 'objectId'
                                      | 'scaled'
                                      | 'url'
                                      | 'width'
                                    >
                                  ) }
                                )>> }
                              )>,
                              uploadedBackground?: Types.Maybe<(
                                { __typename: 'TrelloUploadedBackground' }
                                & Pick<Types.TrelloUploadedBackground, 'objectId'>
                              )>,
                            }
                          )>,
                          description?: Types.Maybe<(
                            { __typename: 'TrelloUserGeneratedText' }
                            & Pick<Types.TrelloUserGeneratedText, 'text'>
                          )>,
                          due?: Types.Maybe<(
                            { __typename: 'TrelloCardDueInfo' }
                            & Pick<Types.TrelloCardDueInfo, 'at' | 'reminder'>
                          )>,
                          onChecklistDeleted?: Types.Maybe<Array<(
                            { __typename: 'TrelloChecklistDeleted' }
                            & Pick<Types.TrelloChecklistDeleted, 'id'>
                          )>>,
                        }
                      )
                     }
                  )>> }
                )>,
                onCardDeleted?: Types.Maybe<Array<(
                  { __typename: 'TrelloCardDeleted' }
                  & Pick<Types.TrelloCardDeleted, 'id'>
                )>>,
              }
            ) }
          )>> }
        )>,
        onCustomFieldDeleted?: Types.Maybe<Array<(
          { __typename: 'TrelloCustomFieldDeleted' }
          & Pick<Types.TrelloCustomFieldDeleted, 'id'>
        )>>,
        onLabelDeleted?: Types.Maybe<Array<(
          { __typename: 'TrelloLabelDeleted' }
          & Pick<Types.TrelloLabelDeleted, 'id'>
        )>>,
        powerUps?: Types.Maybe<(
          { __typename: 'TrelloBoardPowerUpConnectionUpdated' }
          & { edges?: Types.Maybe<Array<(
            { __typename: 'TrelloBoardPowerUpEdgeUpdated' }
            & Pick<Types.TrelloBoardPowerUpEdgeUpdated, 'objectId'>
            & { node: (
              { __typename: 'TrelloPowerUp' }
              & Pick<Types.TrelloPowerUp, 'objectId'>
            ) }
          )>> }
        )>,
      }
    )> }
  ) }
);

/**
 * __useTrelloMirrorCardsSubscription__
 *
 * To run a query within a React component, call `useTrelloMirrorCardsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTrelloMirrorCardsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloMirrorCardsSubscription({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      nodeIds: // value for 'nodeIds'
 *   },
 * });
 */
export function useTrelloMirrorCardsSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    TrelloMirrorCardsSubscription,
    TrelloMirrorCardsSubscriptionVariables
  > &
    (
      | { variables: TrelloMirrorCardsSubscriptionVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    TrelloMirrorCardsSubscription,
    TrelloMirrorCardsSubscriptionVariables
  >(TrelloMirrorCardsDocument, options);
}
export type TrelloMirrorCardsSubscriptionHookResult = ReturnType<
  typeof useTrelloMirrorCardsSubscription
>;
export type TrelloMirrorCardsSubscriptionResult =
  Apollo.SubscriptionResult<TrelloMirrorCardsSubscription>;
