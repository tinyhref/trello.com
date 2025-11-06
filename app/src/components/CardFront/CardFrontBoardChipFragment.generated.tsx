import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardFrontBoardChipFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id'>
  & {
    board: (
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'name' | 'url'>
      & { prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<
          Types.Board_Prefs,
          | 'backgroundBrightness'
          | 'backgroundColor'
          | 'backgroundImage'
          | 'backgroundTopColor'
        >
        & { backgroundImageScaled?: Types.Maybe<Array<(
          { __typename: 'Board_Prefs_BackgroundImageScaled' }
          & Pick<Types.Board_Prefs_BackgroundImageScaled, 'height' | 'url' | 'width'>
        )>> }
      )> }
    ),
    list: (
      { __typename: 'List' }
      & Pick<Types.List, 'name'>
    ),
  }
);

export const CardFrontBoardChipFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardFrontBoardChip' },
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
            name: { kind: 'Name', value: 'board' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'prefs' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'backgroundBrightness' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'backgroundColor' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'backgroundImage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'backgroundImageScaled' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'height' },
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
                        name: { kind: 'Name', value: 'backgroundTopColor' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'list' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardFrontBoardChipFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardFrontBoardChipFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardFrontBoardChipFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardFrontBoardChipFragment>, 'data'> {
  data?: CardFrontBoardChipFragment;
}

export const useCardFrontBoardChipFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardFrontBoardChipFragmentOptions): UseCardFrontBoardChipFragmentResult => {
  const result = Apollo.useFragment<CardFrontBoardChipFragment>({
    ...options,
    fragment: CardFrontBoardChipFragmentDoc,
    fragmentName: 'CardFrontBoardChip',
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

  return { ...result, data: result.data as CardFrontBoardChipFragment };
};
