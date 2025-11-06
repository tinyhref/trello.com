import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ListComposerBoardListLimitsFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id'>
  & {
    limits: (
      { __typename: 'Board_Limits' }
      & { lists: (
        { __typename: 'Board_Limits_Lists' }
        & {
          openPerBoard: (
            { __typename: 'Limit' }
            & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
          ),
          totalPerBoard: (
            { __typename: 'Limit' }
            & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
          ),
        }
      ) }
    ),
    lists: Array<(
      { __typename: 'List' }
      & Pick<Types.List, 'id'>
    )>,
  }
);

export const ListComposerBoardListLimitsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ListComposerBoardListLimits' },
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
                              name: { kind: 'Name', value: 'disableAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'warnAt' },
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
                              name: { kind: 'Name', value: 'disableAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'warnAt' },
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
            name: { kind: 'Name', value: 'lists' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'EnumValue', value: 'open' },
              },
            ],
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

interface UseListComposerBoardListLimitsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      ListComposerBoardListLimitsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseListComposerBoardListLimitsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<ListComposerBoardListLimitsFragment>,
    'data'
  > {
  data?: ListComposerBoardListLimitsFragment;
}

export const useListComposerBoardListLimitsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseListComposerBoardListLimitsFragmentOptions): UseListComposerBoardListLimitsFragmentResult => {
  const result = Apollo.useFragment<ListComposerBoardListLimitsFragment>({
    ...options,
    fragment: ListComposerBoardListLimitsFragmentDoc,
    fragmentName: 'ListComposerBoardListLimits',
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

  return {
    ...result,
    data: result.data as ListComposerBoardListLimitsFragment,
  };
};
