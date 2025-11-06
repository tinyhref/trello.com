import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardMoveLimitsBoardFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'name'>
  & { limits: (
    { __typename: 'Board_Limits' }
    & {
      attachments: (
        { __typename: 'Board_Limits_Attachments' }
        & { perBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'status'>
        ) }
      ),
      cards: (
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
      ),
      checklists: (
        { __typename: 'Board_Limits_Checklists' }
        & { perBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'status'>
        ) }
      ),
      labels: (
        { __typename: 'Board_Limits_Labels' }
        & { perBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status'>
        ) }
      ),
    }
  ) }
);

export const CardMoveLimitsBoardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardMoveLimitsBoard' },
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
                  name: { kind: 'Name', value: 'attachments' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'perBoard' },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'checklists' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'perBoard' },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'labels' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'perBoard' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'disableAt' },
                            },
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

interface UseCardMoveLimitsBoardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardMoveLimitsBoardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardMoveLimitsBoardFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardMoveLimitsBoardFragment>, 'data'> {
  data?: CardMoveLimitsBoardFragment;
}

export const useCardMoveLimitsBoardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardMoveLimitsBoardFragmentOptions): UseCardMoveLimitsBoardFragmentResult => {
  const result = Apollo.useFragment<CardMoveLimitsBoardFragment>({
    ...options,
    fragment: CardMoveLimitsBoardFragmentDoc,
    fragmentName: 'CardMoveLimitsBoard',
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

  return { ...result, data: result.data as CardMoveLimitsBoardFragment };
};
