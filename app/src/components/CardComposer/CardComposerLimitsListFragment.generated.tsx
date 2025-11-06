import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardComposerLimitsListFragment = (
  { __typename: 'List' }
  & Pick<Types.List, 'id' | 'name'>
  & { limits: (
    { __typename: 'List_Limits' }
    & { cards: (
      { __typename: 'List_Limits_Cards' }
      & {
        openPerList: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'status'>
        ),
        totalPerList: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'status'>
        ),
      }
    ) }
  ) }
);

export const CardComposerLimitsListFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardComposerLimitsList' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
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
                        name: { kind: 'Name', value: 'openPerList' },
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
                        name: { kind: 'Name', value: 'totalPerList' },
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

interface UseCardComposerLimitsListFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardComposerLimitsListFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardComposerLimitsListFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<CardComposerLimitsListFragment>,
    'data'
  > {
  data?: CardComposerLimitsListFragment;
}

export const useCardComposerLimitsListFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardComposerLimitsListFragmentOptions): UseCardComposerLimitsListFragmentResult => {
  const result = Apollo.useFragment<CardComposerLimitsListFragment>({
    ...options,
    fragment: CardComposerLimitsListFragmentDoc,
    fragmentName: 'CardComposerLimitsList',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'List', ...from },
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

  return { ...result, data: result.data as CardComposerLimitsListFragment };
};
