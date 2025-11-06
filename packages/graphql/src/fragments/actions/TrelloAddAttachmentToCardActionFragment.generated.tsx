import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloAddAttachmentToCardActionFieldsFragment = (
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
);

export const TrelloAddAttachmentToCardActionFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloAddAttachmentToCardActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloAddAttachmentToCardAction' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'displayEntities' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'attachment' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TrelloActionAttachmentEntityFields',
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'attachmentPreview' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'objectId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'originalUrl' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'previewUrl' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'previewUrl2x' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    ],
                  },
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
                          value: 'TrelloActionCardEntityFields',
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'memberCreator' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TrelloActionMemberEntityFields',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'TrelloCardActionDataFields' },
          },
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'TrelloCoreActionFields' },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloActionAttachmentEntityFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloActionAttachmentEntity' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'link' } },
          { kind: 'Field', name: { kind: 'Name', value: 'objectId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'text' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloActionCardEntityFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloActionCardEntity' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'objectId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shortLink' } },
          { kind: 'Field', name: { kind: 'Name', value: 'text' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloActionMemberEntityFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloActionMemberEntity' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'text' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloCardActionDataFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCardActionData' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'card' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloCoreActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloAction' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'appCreator' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'creator' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'date' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayKey' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'reactions' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'emoji' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'native' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'shortName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'skinVariation' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'unified' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'member' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'objectId' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'objectId' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseTrelloAddAttachmentToCardActionFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloAddAttachmentToCardActionFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloAddAttachmentToCardActionFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloAddAttachmentToCardActionFieldsFragment>,
    'data'
  > {
  data?: TrelloAddAttachmentToCardActionFieldsFragment;
}

export const useTrelloAddAttachmentToCardActionFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloAddAttachmentToCardActionFieldsFragmentOptions): UseTrelloAddAttachmentToCardActionFieldsFragmentResult => {
  const result =
    Apollo.useFragment<TrelloAddAttachmentToCardActionFieldsFragment>({
      ...options,
      fragment: TrelloAddAttachmentToCardActionFieldsFragmentDoc,
      fragmentName: 'TrelloAddAttachmentToCardActionFields',
      from:
        !from || !(from as Apollo.StoreObject)?.id
          ? null
          : { __typename: 'TrelloAddAttachmentToCardAction', ...from },
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
    data: result.data as TrelloAddAttachmentToCardActionFieldsFragment,
  };
};
