import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardTypeFragment = (
  { __typename: 'Card' }
  & Pick<
    Types.Card,
    | 'id'
    | 'cardRole'
    | 'creationMethod'
    | 'creationMethodError'
    | 'creationMethodLoadingStartedAt'
    | 'idAttachmentCover'
  >
  & {
    attachments: Array<(
      { __typename: 'Attachment' }
      & Pick<Types.Attachment, 'id' | 'isMalicious'>
    )>,
    badges: (
      { __typename: 'Card_Badges' }
      & Pick<Types.Card_Badges, 'lastUpdatedByAi'>
    ),
    cover?: Types.Maybe<(
      { __typename: 'Card_Cover' }
      & Pick<
        Types.Card_Cover,
        | 'color'
        | 'idAttachment'
        | 'idPlugin'
        | 'idUploadedBackground'
        | 'size'
      >
    )>,
  }
);

export const CardTypeFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardType' },
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
            name: { kind: 'Name', value: 'badges' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'lastUpdatedByAi' },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'cardRole' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cover' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idAttachment' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'idPlugin' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idUploadedBackground' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'size' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'creationMethod' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'creationMethodError' },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'creationMethodLoadingStartedAt' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idAttachmentCover' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardTypeFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<CardTypeFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardTypeFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardTypeFragment>, 'data'> {
  data?: CardTypeFragment;
}

export const useCardTypeFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardTypeFragmentOptions): UseCardTypeFragmentResult => {
  const result = Apollo.useFragment<CardTypeFragment>({
    ...options,
    fragment: CardTypeFragmentDoc,
    fragmentName: 'CardType',
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

  return { ...result, data: result.data as CardTypeFragment };
};
