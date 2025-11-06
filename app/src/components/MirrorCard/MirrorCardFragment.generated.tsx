import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MirrorCardFragment = (
  { __typename: 'Card' }
  & Pick<
    Types.Card,
    | 'id'
    | 'closed'
    | 'dueComplete'
    | 'idChecklists'
    | 'idList'
    | 'idMembers'
    | 'name'
    | 'nodeId'
    | 'shortLink'
    | 'url'
  >
  & {
    attachments: Array<(
      { __typename: 'Attachment' }
      & Pick<
        Types.Attachment,
        | 'id'
        | 'bytes'
        | 'date'
        | 'edgeColor'
        | 'fileName'
        | 'idMember'
        | 'isMalicious'
        | 'isUpload'
        | 'mimeType'
        | 'name'
        | 'pos'
        | 'url'
      >
    )>,
    badges: (
      { __typename: 'Card_Badges' }
      & Pick<
        Types.Card_Badges,
        | 'attachments'
        | 'checkItems'
        | 'checkItemsChecked'
        | 'checkItemsEarliestDue'
        | 'comments'
        | 'description'
        | 'due'
        | 'dueComplete'
        | 'externalSource'
        | 'lastUpdatedByAi'
        | 'location'
        | 'maliciousAttachments'
        | 'start'
        | 'subscribed'
        | 'viewingMemberVoted'
        | 'votes'
      >
      & { attachmentsByType: (
        { __typename: 'Card_Badges_AttachmentsByType' }
        & { trello: (
          { __typename: 'Card_Badges_AttachmentsByType_Trello' }
          & Pick<Types.Card_Badges_AttachmentsByType_Trello, 'board' | 'card'>
        ) }
      ) }
    ),
    board: (
      { __typename: 'Board' }
      & Pick<
        Types.Board,
        | 'id'
        | 'closed'
        | 'nodeId'
        | 'shortLink'
      >
    ),
    checklists: Array<(
      { __typename: 'Checklist' }
      & Pick<
        Types.Checklist,
        | 'id'
        | 'idBoard'
        | 'idCard'
        | 'name'
        | 'pos'
      >
      & { checkItems: Array<(
        { __typename: 'CheckItem' }
        & Pick<Types.CheckItem, 'id'>
      )> }
    )>,
    customFieldItems: Array<(
      { __typename: 'CustomFieldItem' }
      & Pick<Types.CustomFieldItem, 'id' | 'idCustomField' | 'idValue'>
      & { value?: Types.Maybe<(
        { __typename: 'CustomFieldItem_Value' }
        & Pick<
          Types.CustomFieldItem_Value,
          | 'checked'
          | 'date'
          | 'number'
          | 'text'
        >
      )> }
    )>,
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
    list: (
      { __typename: 'List' }
      & Pick<Types.List, 'id' | 'closed' | 'name'>
    ),
    stickers: Array<(
      { __typename: 'Sticker' }
      & Pick<
        Types.Sticker,
        | 'id'
        | 'image'
        | 'imageUrl'
        | 'left'
        | 'rotate'
        | 'top'
        | 'zIndex'
      >
      & { imageScaled: Array<(
        { __typename: 'Sticker_ImageScaled' }
        & Pick<
          Types.Sticker_ImageScaled,
          | 'id'
          | 'height'
          | 'scaled'
          | 'url'
          | 'width'
        >
      )> }
    )>,
  }
);

export const MirrorCardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MirrorCard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bytes' } },
                { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                { kind: 'Field', name: { kind: 'Name', value: 'edgeColor' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fileName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idMember' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isMalicious' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isUpload' } },
                { kind: 'Field', name: { kind: 'Name', value: 'mimeType' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'pos' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'badges' },
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'board' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'card' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'checkItems' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'checkItemsChecked' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'checkItemsEarliestDue' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'comments' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'due' } },
                { kind: 'Field', name: { kind: 'Name', value: 'dueComplete' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'externalSource' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'lastUpdatedByAi' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'location' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'maliciousAttachments' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'start' } },
                { kind: 'Field', name: { kind: 'Name', value: 'subscribed' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'viewingMemberVoted' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'votes' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'board' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
                { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'shortLink' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'checklists' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'checkItems' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'idBoard' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idCard' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'pos' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFieldItems' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idCustomField' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'idValue' } },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'number' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'text' } },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'dueComplete' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idChecklists' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idList' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idMembers' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'labels' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idBoard' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'list' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shortLink' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'stickers' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'image' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'imageScaled' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'height' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'scaled' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'width' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'imageUrl' } },
                { kind: 'Field', name: { kind: 'Name', value: 'left' } },
                { kind: 'Field', name: { kind: 'Name', value: 'rotate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'top' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zIndex' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMirrorCardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<MirrorCardFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMirrorCardFragmentResult
  extends Omit<Apollo.UseFragmentResult<MirrorCardFragment>, 'data'> {
  data?: MirrorCardFragment;
}

export const useMirrorCardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMirrorCardFragmentOptions): UseMirrorCardFragmentResult => {
  const result = Apollo.useFragment<MirrorCardFragment>({
    ...options,
    fragment: MirrorCardFragmentDoc,
    fragmentName: 'MirrorCard',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Card', ...from },
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

  return { ...result, data: result.data as MirrorCardFragment };
};
