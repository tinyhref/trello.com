import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardAttachmentLimitsFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id'>
  & { limits: (
    { __typename: 'Card_Limits' }
    & { attachments: (
      { __typename: 'Card_Limits_Attachments' }
      & { perCard: (
        { __typename: 'Card_Limits_Attachments_PerCard' }
        & Pick<Types.Card_Limits_Attachments_PerCard, 'status'>
      ) }
    ) }
  ) }
);

export const CardAttachmentLimitsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardAttachmentLimits' },
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
                  name: { kind: 'Name', value: 'attachments' },
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

interface UseCardAttachmentLimitsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardAttachmentLimitsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardAttachmentLimitsFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardAttachmentLimitsFragment>, 'data'> {
  data?: CardAttachmentLimitsFragment;
}

export const useCardAttachmentLimitsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardAttachmentLimitsFragmentOptions): UseCardAttachmentLimitsFragmentResult => {
  const result = Apollo.useFragment<CardAttachmentLimitsFragment>({
    ...options,
    fragment: CardAttachmentLimitsFragmentDoc,
    fragmentName: 'CardAttachmentLimits',
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

  return { ...result, data: result.data as CardAttachmentLimitsFragment };
};
