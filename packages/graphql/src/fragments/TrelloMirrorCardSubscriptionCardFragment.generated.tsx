import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloMirrorCardSubscriptionCardFragment = (
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
    description?: Types.Maybe<(
      { __typename: 'TrelloUserGeneratedText' }
      & Pick<Types.TrelloUserGeneratedText, 'text'>
    )>,
    due?: Types.Maybe<(
      { __typename: 'TrelloCardDueInfo' }
      & Pick<Types.TrelloCardDueInfo, 'at' | 'reminder'>
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
    onChecklistDeleted?: Types.Maybe<Array<(
      { __typename: 'TrelloChecklistDeleted' }
      & Pick<Types.TrelloChecklistDeleted, 'id'>
    )>>,
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
);

export const TrelloMirrorCardSubscriptionCardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloMirrorCardSubscriptionCard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCardUpdated' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'attachments' },
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
                              name: { kind: 'Name', value: 'bytes' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'creatorId' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'date' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'edgeColor' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'isMalicious' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'isUpload' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'mimeType' },
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
                              name: { kind: 'Name', value: 'position' },
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
                                                name: {
                                                  kind: 'Name',
                                                  value: 'bytes',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'height',
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
                                                  value: 'scaled',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'url',
                                                },
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
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'url' },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'checklists' },
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
                              name: { kind: 'Name', value: 'checkItems' },
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
                                                  value: 'id',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'due',
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'at',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'reminder',
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'member',
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'id',
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'name',
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
                                                  value: 'state',
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
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'objectId' },
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
            name: { kind: 'Name', value: 'description' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'text' } },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'labels' },
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
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'coordinates' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'latitude' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'longitude' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'staticMapUrl' },
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
                              name: { kind: 'Name', value: 'nonPublicData' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
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
                                ],
                              },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'membersVoted' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'objectId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'onChecklistDeleted' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'position' } },
          { kind: 'Field', name: { kind: 'Name', value: 'startedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'stickers' },
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

interface UseTrelloMirrorCardSubscriptionCardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloMirrorCardSubscriptionCardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloMirrorCardSubscriptionCardFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloMirrorCardSubscriptionCardFragment>,
    'data'
  > {
  data?: TrelloMirrorCardSubscriptionCardFragment;
}

export const useTrelloMirrorCardSubscriptionCardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloMirrorCardSubscriptionCardFragmentOptions): UseTrelloMirrorCardSubscriptionCardFragmentResult => {
  const result = Apollo.useFragment<TrelloMirrorCardSubscriptionCardFragment>({
    ...options,
    fragment: TrelloMirrorCardSubscriptionCardFragmentDoc,
    fragmentName: 'TrelloMirrorCardSubscriptionCard',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloCardUpdated', ...from },
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

  return {
    ...result,
    data: result.data as TrelloMirrorCardSubscriptionCardFragment,
  };
};
