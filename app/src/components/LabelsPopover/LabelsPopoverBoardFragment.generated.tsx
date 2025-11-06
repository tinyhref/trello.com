import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type LabelsPopoverBoardFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'name'>
  & {
    labels: Array<(
      { __typename: 'Label' }
      & Pick<Types.Label, 'id' | 'color' | 'name'>
    )>,
    limits: (
      { __typename: 'Board_Limits' }
      & { labels: (
        { __typename: 'Board_Limits_Labels' }
        & { perBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status'>
        ) }
      ) }
    ),
  }
);

export const LabelsPopoverBoardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LabelsPopoverBoard' },
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
            name: { kind: 'Name', value: 'labels' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'EnumValue', value: 'all' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'limits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
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

interface UseLabelsPopoverBoardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      LabelsPopoverBoardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseLabelsPopoverBoardFragmentResult
  extends Omit<Apollo.UseFragmentResult<LabelsPopoverBoardFragment>, 'data'> {
  data?: LabelsPopoverBoardFragment;
}

export const useLabelsPopoverBoardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseLabelsPopoverBoardFragmentOptions): UseLabelsPopoverBoardFragmentResult => {
  const result = Apollo.useFragment<LabelsPopoverBoardFragment>({
    ...options,
    fragment: LabelsPopoverBoardFragmentDoc,
    fragmentName: 'LabelsPopoverBoard',
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

  return { ...result, data: result.data as LabelsPopoverBoardFragment };
};
