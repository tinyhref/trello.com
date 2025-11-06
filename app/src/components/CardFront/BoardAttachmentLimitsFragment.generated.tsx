import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardAttachmentLimitsFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id'>
  & { limits: (
    { __typename: 'Board_Limits' }
    & { attachments: (
      { __typename: 'Board_Limits_Attachments' }
      & { perBoard: (
        { __typename: 'Limit' }
        & Pick<Types.Limit, 'status'>
      ) }
    ) }
  ) }
);

export const BoardAttachmentLimitsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardAttachmentLimits' },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardAttachmentLimitsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardAttachmentLimitsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardAttachmentLimitsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<BoardAttachmentLimitsFragment>,
    'data'
  > {
  data?: BoardAttachmentLimitsFragment;
}

export const useBoardAttachmentLimitsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardAttachmentLimitsFragmentOptions): UseBoardAttachmentLimitsFragmentResult => {
  const result = Apollo.useFragment<BoardAttachmentLimitsFragment>({
    ...options,
    fragment: BoardAttachmentLimitsFragmentDoc,
    fragmentName: 'BoardAttachmentLimits',
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

  return { ...result, data: result.data as BoardAttachmentLimitsFragment };
};
