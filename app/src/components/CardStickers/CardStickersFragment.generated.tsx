import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardStickersFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id'>
  & { stickers: Array<(
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
  )> }
);

export const CardStickersFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardStickers' },
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
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardStickersFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<CardStickersFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardStickersFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardStickersFragment>, 'data'> {
  data?: CardStickersFragment;
}

export const useCardStickersFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardStickersFragmentOptions): UseCardStickersFragmentResult => {
  const result = Apollo.useFragment<CardStickersFragment>({
    ...options,
    fragment: CardStickersFragmentDoc,
    fragmentName: 'CardStickers',
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

  return { ...result, data: result.data as CardStickersFragment };
};
