import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardComposerLimitsBoardFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'name'>
  & { limits: (
    { __typename: 'Board_Limits' }
    & { cards: (
      { __typename: 'Board_Limits_Cards' }
      & {
        openPerBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'status'>
        ),
        totalPerBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'status'>
        ),
      }
    ) }
  ) }
);

export const CardComposerLimitsBoardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardComposerLimitsBoard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
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
                  name: { kind: 'Name', value: 'cards' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'openPerBoard' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalPerBoard' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
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
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardComposerLimitsBoardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardComposerLimitsBoardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardComposerLimitsBoardFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<CardComposerLimitsBoardFragment>,
    'data'
  > {
  data?: CardComposerLimitsBoardFragment;
}

export const useCardComposerLimitsBoardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardComposerLimitsBoardFragmentOptions): UseCardComposerLimitsBoardFragmentResult => {
  const result = Apollo.useFragment<CardComposerLimitsBoardFragment>({
    ...options,
    fragment: CardComposerLimitsBoardFragmentDoc,
    fragmentName: 'CardComposerLimitsBoard',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Board', ...from },
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

  return { ...result, data: result.data as CardComposerLimitsBoardFragment };
};
