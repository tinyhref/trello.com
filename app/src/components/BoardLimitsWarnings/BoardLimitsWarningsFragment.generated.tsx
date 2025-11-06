import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardLimitsWarningsFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id'>
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
        & {
          perBoard: (
            { __typename: 'Limit' }
            & Pick<Types.Limit, 'status'>
          ),
          perCard: (
            { __typename: 'Limit' }
            & Pick<Types.Limit, 'status'>
          ),
        }
      ),
      labels: (
        { __typename: 'Board_Limits_Labels' }
        & { perBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'status'>
        ) }
      ),
      lists: (
        { __typename: 'Board_Limits_Lists' }
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
    }
  ) }
);

export const BoardLimitsWarningsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardLimitsWarnings' },
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'perCard' },
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
                  name: { kind: 'Name', value: 'lists' },
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
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardLimitsWarningsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardLimitsWarningsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardLimitsWarningsFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardLimitsWarningsFragment>, 'data'> {
  data?: BoardLimitsWarningsFragment;
}

export const useBoardLimitsWarningsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardLimitsWarningsFragmentOptions): UseBoardLimitsWarningsFragmentResult => {
  const result = Apollo.useFragment<BoardLimitsWarningsFragment>({
    ...options,
    fragment: BoardLimitsWarningsFragmentDoc,
    fragmentName: 'BoardLimitsWarnings',
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

  return { ...result, data: result.data as BoardLimitsWarningsFragment };
};
