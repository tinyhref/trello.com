import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardStickerCountAndLimitFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id'>
  & {
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

export const CardStickerCountAndLimitFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardStickerCountAndLimit' },
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

interface UseCardStickerCountAndLimitFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardStickerCountAndLimitFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardStickerCountAndLimitFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<CardStickerCountAndLimitFragment>,
    'data'
  > {
  data?: CardStickerCountAndLimitFragment;
}

export const useCardStickerCountAndLimitFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardStickerCountAndLimitFragmentOptions): UseCardStickerCountAndLimitFragmentResult => {
  const result = Apollo.useFragment<CardStickerCountAndLimitFragment>({
    ...options,
    fragment: CardStickerCountAndLimitFragmentDoc,
    fragmentName: 'CardStickerCountAndLimit',
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

  return { ...result, data: result.data as CardStickerCountAndLimitFragment };
};
