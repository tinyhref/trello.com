import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardCoverFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id' | 'idAttachmentCover'>
  & {
    attachments: Array<(
      { __typename: 'Attachment' }
      & Pick<Types.Attachment, 'id' | 'isMalicious'>
    )>,
    cover?: Types.Maybe<(
      { __typename: 'Card_Cover' }
      & Pick<
        Types.Card_Cover,
        | 'brightness'
        | 'color'
        | 'edgeColor'
        | 'idAttachment'
        | 'idPlugin'
        | 'idUploadedBackground'
        | 'sharedSourceUrl'
        | 'size'
      >
      & { scaled?: Types.Maybe<Array<(
        { __typename: 'Card_Cover_Scaled' }
        & Pick<
          Types.Card_Cover_Scaled,
          | 'id'
          | 'height'
          | 'scaled'
          | 'url'
          | 'width'
        >
      )>> }
    )>,
    limits: (
      { __typename: 'Card_Limits' }
      & { stickers: (
        { __typename: 'Card_Limits_Stickers' }
        & { perCard: (
          { __typename: 'Card_Limits_Stickers_PerCard' }
          & Pick<Types.Card_Limits_Stickers_PerCard, 'disableAt'>
        ) }
      ) }
    ),
    stickers: Array<(
      { __typename: 'Sticker' }
      & Pick<Types.Sticker, 'id'>
    )>,
  }
);

export const CardCoverFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardCover' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'isMalicious' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cover' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'brightness' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'edgeColor' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idAttachment' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'idPlugin' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idUploadedBackground' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'scaled' },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sharedSourceUrl' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'size' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idAttachmentCover' } },
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
            name: { kind: 'Name', value: 'stickers' },
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
  ],
} as unknown as DocumentNode;

interface UseCardCoverFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<CardCoverFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardCoverFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardCoverFragment>, 'data'> {
  data?: CardCoverFragment;
}

export const useCardCoverFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardCoverFragmentOptions): UseCardCoverFragmentResult => {
  const result = Apollo.useFragment<CardCoverFragment>({
    ...options,
    fragment: CardCoverFragmentDoc,
    fragmentName: 'CardCover',
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

  return { ...result, data: result.data as CardCoverFragment };
};
