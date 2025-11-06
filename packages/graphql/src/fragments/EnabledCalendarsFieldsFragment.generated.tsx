import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type EnabledCalendarsFieldsFragment = (
  { __typename: 'TrelloPlannerCalendarConnection' }
  & {
    edges?: Types.Maybe<Array<(
      { __typename: 'TrelloPlannerCalendarEdge' }
      & { node?: Types.Maybe<(
        { __typename: 'TrelloPlannerCalendar' }
        & Pick<
          Types.TrelloPlannerCalendar,
          | 'id'
          | 'color'
          | 'enabled'
          | 'forceUpdateTimestamp'
          | 'isPrimary'
          | 'providerCalendarId'
          | 'title'
        >
        & { events?: Types.Maybe<(
          { __typename: 'TrelloPlannerCalendarEventConnection' }
          & {
            edges?: Types.Maybe<Array<(
              { __typename: 'TrelloPlannerCalendarEventEdge' }
              & { node?: Types.Maybe<(
                { __typename: 'TrelloPlannerCalendarEvent' }
                & Pick<
                  Types.TrelloPlannerCalendarEvent,
                  | 'id'
                  | 'allDay'
                  | 'color'
                  | 'endAt'
                  | 'eventType'
                  | 'link'
                  | 'parentEventId'
                  | 'plannerCalendarId'
                  | 'startAt'
                  | 'status'
                  | 'title'
                  | 'visibility'
                >
                & {
                  cards?: Types.Maybe<(
                    { __typename: 'TrelloPlannerCalendarEventCardConnection' }
                    & { edges?: Types.Maybe<Array<(
                      { __typename: 'TrelloPlannerCalendarEventCardEdge' }
                      & { node?: Types.Maybe<(
                        { __typename: 'TrelloPlannerCalendarEventCard' }
                        & Pick<Types.TrelloPlannerCalendarEventCard, 'id' | 'position'>
                        & { card?: Types.Maybe<(
                          { __typename: 'TrelloCard' }
                          & Pick<
                            Types.TrelloCard,
                            | 'id'
                            | 'closed'
                            | 'complete'
                            | 'isTemplate'
                            | 'lastActivityAt'
                            | 'mirrorSourceId'
                            | 'name'
                            | 'objectId'
                            | 'pinned'
                            | 'role'
                            | 'shortLink'
                            | 'startedAt'
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
                                  & Pick<Types.TrelloAttachment, 'id'>
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
                              & Pick<Types.TrelloList, 'id' | 'name' | 'objectId'>
                              & { board?: Types.Maybe<(
                                { __typename: 'TrelloBoard' }
                                & Pick<
                                  Types.TrelloBoard,
                                  | 'id'
                                  | 'closed'
                                  | 'name'
                                  | 'objectId'
                                  | 'premiumFeatures'
                                  | 'url'
                                >
                                & {
                                  enterprise?: Types.Maybe<(
                                    { __typename: 'TrelloEnterprise' }
                                    & Pick<Types.TrelloEnterprise, 'id' | 'objectId'>
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
                                          & Pick<Types.TrelloMember, 'id'>
                                        )>,
                                      }
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
                                      | 'cardAging'
                                      | 'cardCovers'
                                      | 'comments'
                                      | 'isTemplate'
                                      | 'permissionLevel'
                                      | 'selfJoin'
                                      | 'showCompleteStatus'
                                      | 'voting'
                                    >
                                    & { background?: Types.Maybe<(
                                      { __typename: 'TrelloBoardBackground' }
                                      & Pick<
                                        Types.TrelloBoardBackground,
                                        | 'brightness'
                                        | 'color'
                                        | 'image'
                                        | 'topColor'
                                      >
                                      & { imageScaled?: Types.Maybe<Array<(
                                        { __typename: 'TrelloScaleProps' }
                                        & Pick<Types.TrelloScaleProps, 'height' | 'url' | 'width'>
                                      )>> }
                                    )> }
                                  ),
                                }
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
                        )> }
                      )> }
                    )>> }
                  )>,
                  conferencing?: Types.Maybe<(
                    { __typename: 'TrelloPlannerCalendarEventConferencing' }
                    & Pick<Types.TrelloPlannerCalendarEventConferencing, 'url'>
                  )>,
                }
              )> }
            )>>,
            pageInfo: (
              { __typename: 'PageInfo' }
              & Pick<Types.PageInfo, 'endCursor' | 'hasNextPage'>
            ),
          }
        )> }
      )> }
    )>>,
    pageInfo: (
      { __typename: 'PageInfo' }
      & Pick<Types.PageInfo, 'endCursor' | 'hasNextPage'>
    ),
  }
);

export const EnabledCalendarsFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EnabledCalendarsFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloPlannerCalendarConnection' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edges' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'node' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'enabled' },
                      },
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'Events' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'forceUpdateTimestamp' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'isPrimary' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'providerCalendarId' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pageInfo' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'endCursor' } },
                { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'Events' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloPlannerCalendar' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'events' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'start' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'start' },
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'end' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'end' },
                      },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'IntValue', value: '50' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'EventsFields' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'endCursor' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hasNextPage' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventsFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloPlannerCalendarEvent' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'allDay' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cards' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'IntValue', value: '10' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'card' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'FragmentSpread',
                                    name: {
                                      kind: 'Name',
                                      value: 'PlannerCardFrontFields',
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'position' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'conferencing' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'endAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'eventType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'link' } },
          { kind: 'Field', name: { kind: 'Name', value: 'parentEventId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'plannerCalendarId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'startAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'visibility' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PlannerCardFrontFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCard' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'attachments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'IntValue', value: '-1' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'isMalicious' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'objectId' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'badges' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'TrelloAllCardBadges' },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'complete' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cover' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'attachment' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'brightness' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'edgeColor' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'powerUp' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'objectId' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'previews' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'edges' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'node' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'bytes' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'height' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'objectId' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'scaled' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'url' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'width' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sharedSourceUrl' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'size' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'uploadedBackground' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'objectId' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFieldItems' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'IntValue', value: '-1' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'customField' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'display' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'cardFront',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'name' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'objectId' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'options' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'color',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'objectId',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'position',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'value',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'text',
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'position' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'type' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'objectId' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'value' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'checked' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'date' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'number' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'objectId' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'text' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'due' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'at' } },
                { kind: 'Field', name: { kind: 'Name', value: 'reminder' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'labels' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'IntValue', value: '-1' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'color' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'objectId' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'lastActivityAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'limits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'stickers' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'perCard' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'disableAt' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'list' },
            directives: [
              {
                kind: 'Directive',
                name: { kind: 'Name', value: 'optIn' },
                arguments: [
                  {
                    kind: 'Argument',
                    name: { kind: 'Name', value: 'to' },
                    value: {
                      kind: 'StringValue',
                      value: 'TrelloListBoard',
                      block: false,
                    },
                  },
                ],
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'board' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'closed' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'enterprise' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'objectId' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'members' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'edges' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'membership' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'deactivated',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'objectId',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'type' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'unconfirmed',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'workspaceMemberType',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'node' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'objectId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'powerUps' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'edges' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'node' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'objectId',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'objectId' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'prefs' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'background' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'brightness' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'color' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'image' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'imageScaled',
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'height',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'url' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'width',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'topColor' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'cardAging' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'cardCovers' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'comments' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'isTemplate' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'permissionLevel' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'selfJoin' },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'showCompleteStatus',
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'voting' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'premiumFeatures' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'objectId' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'members' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'IntValue', value: '-1' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'avatarUrl' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fullName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'initials' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'objectId' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'username' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'mirrorSourceId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'objectId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pinned' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'powerUpData' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'objectId' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'powerUp' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'objectId' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'value' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'role' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shortLink' } },
          { kind: 'Field', name: { kind: 'Name', value: 'startedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'stickers' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'IntValue', value: '-1' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'image' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'imageScaled' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'height' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'objectId' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'scaled' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'url' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'width' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'left' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'objectId' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'rotate' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'top' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'url' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'zIndex' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloAllCardBadges' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCardBadges' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'attachments' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'attachmentsByType' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'trello' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'board' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'card' } },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'checkItems' } },
          { kind: 'Field', name: { kind: 'Name', value: 'checkItemsChecked' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'checkItemsEarliestDue' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'comments' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'due' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'at' } },
                { kind: 'Field', name: { kind: 'Name', value: 'complete' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'externalSource' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastUpdatedByAi' } },
          { kind: 'Field', name: { kind: 'Name', value: 'location' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'maliciousAttachments' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'startedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'viewer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'subscribed' } },
                { kind: 'Field', name: { kind: 'Name', value: 'voted' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'votes' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseEnabledCalendarsFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      EnabledCalendarsFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseEnabledCalendarsFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<EnabledCalendarsFieldsFragment>,
    'data'
  > {
  data?: EnabledCalendarsFieldsFragment;
}

export const useEnabledCalendarsFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseEnabledCalendarsFieldsFragmentOptions): UseEnabledCalendarsFieldsFragmentResult => {
  const result = Apollo.useFragment<EnabledCalendarsFieldsFragment>({
    ...options,
    fragment: EnabledCalendarsFieldsFragmentDoc,
    fragmentName: 'EnabledCalendarsFields',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloPlannerCalendarConnection', ...from },
  });

  // Ensure that the fragment result is not typed as a DeepPartial.
  if (!result.complete && !returnPartialData) {
    if (process.env.NODE_ENV === 'development') {
      if (
        localStorage.getItem('HIDE_FRAGMENT_WARNINGS') === 'false' ||
        localStorage.getItem('HIDE_FRAGMENT_WARNINGS') === null
      ) {
        console.warn('Fragment data is incomplete.', result);
      }
    }
    return {
      ...result,
      data: undefined,
    };
  }

  return { ...result, data: result.data as EnabledCalendarsFieldsFragment };
};
