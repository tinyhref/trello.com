import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloBoardMirrorCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrelloBoardMirrorCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloShortLink"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"boardMirrorCardInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shortLink"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloBoardMirrorCardInfo","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"mirrorCards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"mirrorCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sourceBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"display"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"cardFront"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"powerUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"background"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"brightness"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"imageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tile"}},{"kind":"Field","name":{"kind":"Name","value":"topColor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardAging"}},{"kind":"Field","name":{"kind":"Name","value":"cardCovers"}},{"kind":"Field","name":{"kind":"Name","value":"showCompleteStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"workspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"sourceCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"isMalicious"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentsByType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"board"}},{"kind":"Field","name":{"kind":"Name","value":"card"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checkItems"}},{"kind":"Field","name":{"kind":"Name","value":"checkItemsChecked"}},{"kind":"Field","name":{"kind":"Name","value":"checkItemsEarliestDue"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"due"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"at"}},{"kind":"Field","name":{"kind":"Name","value":"complete"}}]}},{"kind":"Field","name":{"kind":"Name","value":"externalSource"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdatedByAi"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"maliciousAttachments"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"voted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"votes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"checklists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"complete"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brightness"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"edgeColor"}},{"kind":"Field","name":{"kind":"Name","value":"powerUp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"bytes"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"sharedSourceUrl"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedBackground"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"creation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"loadingStartedAt"}},{"kind":"Field","name":{"kind":"Name","value":"method"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFieldItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"customField"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"checked"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"due"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"at"}},{"kind":"Field","name":{"kind":"Name","value":"reminder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastActivityAt"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"stickers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"perCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"list"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloListBoard","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"softLimit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"staticMapUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublicData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}}]}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"mirrorSourceId"}},{"kind":"Field","name":{"kind":"Name","value":"mirrorSourceNodeId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"powerUpData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"powerUp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"shortId"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"singleInstrumentationId"}},{"kind":"Field","name":{"kind":"Name","value":"stickers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"imageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"left"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"rotate"}},{"kind":"Field","name":{"kind":"Name","value":"top"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloBoardMirrorCards","document":TrelloBoardMirrorCardsDocument}} as const;
export type TrelloBoardMirrorCardsQueryVariables = Types.Exact<{
  id: Types.Scalars['TrelloShortLink']['input'];
}>;


export type TrelloBoardMirrorCardsQuery = (
  { __typename: 'Query' }
  & { trello: (
    { __typename: 'TrelloQueryApi' }
    & { boardMirrorCardInfo?: Types.Maybe<(
      { __typename: 'TrelloBoardMirrorCards' }
      & Pick<Types.TrelloBoardMirrorCards, 'id'>
      & { mirrorCards?: Types.Maybe<(
        { __typename: 'TrelloMirrorCardConnection' }
        & { edges?: Types.Maybe<Array<(
          { __typename: 'TrelloMirrorCardEdge' }
          & { node?: Types.Maybe<(
            { __typename: 'TrelloMirrorCard' }
            & Pick<Types.TrelloMirrorCard, 'id'>
            & {
              mirrorCard?: Types.Maybe<(
                { __typename: 'TrelloCard' }
                & Pick<Types.TrelloCard, 'id'>
              )>,
              sourceBoard?: Types.Maybe<(
                { __typename: 'TrelloBoard' }
                & Pick<
                  Types.TrelloBoard,
                  | 'id'
                  | 'closed'
                  | 'name'
                  | 'objectId'
                  | 'shortLink'
                  | 'url'
                >
                & {
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
                  enterprise?: Types.Maybe<(
                    { __typename: 'TrelloEnterprise' }
                    & Pick<Types.TrelloEnterprise, 'id' | 'objectId'>
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
                    & Pick<Types.TrelloBoardPrefs, 'cardAging' | 'cardCovers' | 'showCompleteStatus'>
                    & { background?: Types.Maybe<(
                      { __typename: 'TrelloBoardBackground' }
                      & Pick<
                        Types.TrelloBoardBackground,
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
                    )> }
                  ),
                  workspace?: Types.Maybe<(
                    { __typename: 'TrelloWorkspace' }
                    & Pick<Types.TrelloWorkspace, 'id' | 'objectId'>
                  )>,
                }
              )>,
              sourceCard?: Types.Maybe<(
                { __typename: 'TrelloCard' }
                & Pick<
                  Types.TrelloCard,
                  | 'id'
                  | 'closed'
                  | 'complete'
                  | 'isTemplate'
                  | 'lastActivityAt'
                  | 'mirrorSourceId'
                  | 'mirrorSourceNodeId'
                  | 'name'
                  | 'objectId'
                  | 'pinned'
                  | 'role'
                  | 'shortId'
                  | 'shortLink'
                  | 'singleInstrumentationId'
                  | 'url'
                >
                & {
                  attachments?: Types.Maybe<(
                    { __typename: 'TrelloAttachmentConnection' }
                    & { edges?: Types.Maybe<Array<(
                      { __typename: 'TrelloAttachmentEdge' }
                      & { node: (
                        { __typename: 'TrelloAttachment' }
                        & Pick<Types.TrelloAttachment, 'id' | 'isMalicious' | 'objectId'>
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
                    { __typename: 'TrelloChecklistConnection' }
                    & { edges?: Types.Maybe<Array<(
                      { __typename: 'TrelloChecklistEdge' }
                      & { node: (
                        { __typename: 'TrelloChecklist' }
                        & Pick<Types.TrelloChecklist, 'id' | 'objectId'>
                      ) }
                    )>> }
                  )>,
                  cover?: Types.Maybe<(
                    { __typename: 'TrelloCardCover' }
                    & Pick<
                      Types.TrelloCardCover,
                      | 'brightness'
                      | 'color'
                      | 'edgeColor'
                      | 'sharedSourceUrl'
                      | 'size'
                    >
                    & {
                      attachment?: Types.Maybe<(
                        { __typename: 'TrelloAttachment' }
                        & Pick<Types.TrelloAttachment, 'id' | 'objectId'>
                      )>,
                      powerUp?: Types.Maybe<(
                        { __typename: 'TrelloPowerUp' }
                        & Pick<Types.TrelloPowerUp, 'objectId'>
                      )>,
                      previews?: Types.Maybe<(
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
                      )>,
                      uploadedBackground?: Types.Maybe<(
                        { __typename: 'TrelloUploadedBackground' }
                        & Pick<Types.TrelloUploadedBackground, 'objectId'>
                      )>,
                    }
                  )>,
                  creation?: Types.Maybe<(
                    { __typename: 'TrelloCardCreationInfo' }
                    & Pick<Types.TrelloCardCreationInfo, 'loadingStartedAt' | 'method'>
                  )>,
                  customFieldItems?: Types.Maybe<(
                    { __typename: 'TrelloCustomFieldItemConnection' }
                    & { edges?: Types.Maybe<Array<(
                      { __typename: 'TrelloCustomFieldItemEdge' }
                      & { node: (
                        { __typename: 'TrelloCustomFieldItem' }
                        & Pick<Types.TrelloCustomFieldItem, 'objectId'>
                        & {
                          customField?: Types.Maybe<(
                            { __typename: 'TrelloCustomField' }
                            & Pick<Types.TrelloCustomField, 'id' | 'objectId'>
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
                  description?: Types.Maybe<(
                    { __typename: 'TrelloUserGeneratedText' }
                    & Pick<Types.TrelloUserGeneratedText, 'text'>
                  )>,
                  due?: Types.Maybe<(
                    { __typename: 'TrelloCardDueInfo' }
                    & Pick<Types.TrelloCardDueInfo, 'at' | 'reminder'>
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
                    { __typename: 'TrelloCardLimits' }
                    & { stickers?: Types.Maybe<(
                      { __typename: 'TrelloCardLimit' }
                      & { perCard?: Types.Maybe<(
                        { __typename: 'TrelloLimitProps' }
                        & Pick<Types.TrelloLimitProps, 'disableAt'>
                      )> }
                    )> }
                  )>,
                  list?: Types.Maybe<(
                    { __typename: 'TrelloList' }
                    & Pick<
                      Types.TrelloList,
                      | 'id'
                      | 'closed'
                      | 'name'
                      | 'objectId'
                      | 'position'
                      | 'softLimit'
                    >
                    & { board?: Types.Maybe<(
                      { __typename: 'TrelloBoard' }
                      & Pick<Types.TrelloBoard, 'id' | 'objectId'>
                    )> }
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
                    { __typename: 'TrelloMemberConnection' }
                    & { edges?: Types.Maybe<Array<Types.Maybe<(
                      { __typename: 'TrelloMemberEdge' }
                      & { node?: Types.Maybe<(
                        { __typename: 'TrelloMember' }
                        & Pick<
                          Types.TrelloMember,
                          | 'id'
                          | 'avatarUrl'
                          | 'fullName'
                          | 'initials'
                          | 'objectId'
                          | 'username'
                        >
                        & { nonPublicData?: Types.Maybe<(
                          { __typename: 'TrelloMemberNonPublicData' }
                          & Pick<Types.TrelloMemberNonPublicData, 'avatarUrl' | 'fullName' | 'initials'>
                        )> }
                      )> }
                    )>>> }
                  )>,
                  powerUpData?: Types.Maybe<(
                    { __typename: 'TrelloPowerUpDataConnection' }
                    & { edges?: Types.Maybe<Array<(
                      { __typename: 'TrelloPowerUpDataEdge' }
                      & { node: (
                        { __typename: 'TrelloPowerUpData' }
                        & Pick<Types.TrelloPowerUpData, 'id' | 'objectId' | 'value'>
                        & { powerUp?: Types.Maybe<(
                          { __typename: 'TrelloPowerUp' }
                          & Pick<Types.TrelloPowerUp, 'objectId'>
                        )> }
                      ) }
                    )>> }
                  )>,
                  stickers?: Types.Maybe<(
                    { __typename: 'TrelloStickerConnection' }
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
              )>,
            }
          )> }
        )>> }
      )> }
    )> }
  ) }
);

/**
 * __useTrelloBoardMirrorCardsQuery__
 *
 * To run a query within a React component, call `useTrelloBoardMirrorCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrelloBoardMirrorCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloBoardMirrorCardsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTrelloBoardMirrorCardsQuery(
  baseOptions: Apollo.QueryHookOptions<
    TrelloBoardMirrorCardsQuery,
    TrelloBoardMirrorCardsQueryVariables
  > &
    (
      | { variables: TrelloBoardMirrorCardsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    TrelloBoardMirrorCardsQuery,
    TrelloBoardMirrorCardsQueryVariables
  >(TrelloBoardMirrorCardsDocument, options);
}
export function useTrelloBoardMirrorCardsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TrelloBoardMirrorCardsQuery,
    TrelloBoardMirrorCardsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    TrelloBoardMirrorCardsQuery,
    TrelloBoardMirrorCardsQueryVariables
  >(TrelloBoardMirrorCardsDocument, options);
}
export function useTrelloBoardMirrorCardsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        TrelloBoardMirrorCardsQuery,
        TrelloBoardMirrorCardsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    TrelloBoardMirrorCardsQuery,
    TrelloBoardMirrorCardsQueryVariables
  >(TrelloBoardMirrorCardsDocument, options);
}
export type TrelloBoardMirrorCardsQueryHookResult = ReturnType<
  typeof useTrelloBoardMirrorCardsQuery
>;
export type TrelloBoardMirrorCardsLazyQueryHookResult = ReturnType<
  typeof useTrelloBoardMirrorCardsLazyQuery
>;
export type TrelloBoardMirrorCardsSuspenseQueryHookResult = ReturnType<
  typeof useTrelloBoardMirrorCardsSuspenseQuery
>;
export type TrelloBoardMirrorCardsQueryResult = Apollo.QueryResult<
  TrelloBoardMirrorCardsQuery,
  TrelloBoardMirrorCardsQueryVariables
>;
