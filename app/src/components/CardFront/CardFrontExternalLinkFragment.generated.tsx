import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardFrontExternalLinkFragment = (
  { __typename: 'Card' }
  & Pick<
    Types.Card,
    | 'id'
    | 'faviconUrl'
    | 'urlSource'
    | 'urlSourceText'
  >
  & {
    attachments: Array<(
      { __typename: 'Attachment' }
      & Pick<Types.Attachment, 'url'>
    )>,
    badges: (
      { __typename: 'Card_Badges' }
      & Pick<Types.Card_Badges, 'externalSource'>
    ),
  }
);

export const CardFrontExternalLinkFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardFrontExternalLink' },
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
            name: { kind: 'Name', value: 'attachments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'badges' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'externalSource' },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'faviconUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'urlSource' } },
          { kind: 'Field', name: { kind: 'Name', value: 'urlSourceText' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardFrontExternalLinkFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardFrontExternalLinkFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardFrontExternalLinkFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<CardFrontExternalLinkFragment>,
    'data'
  > {
  data?: CardFrontExternalLinkFragment;
}

export const useCardFrontExternalLinkFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardFrontExternalLinkFragmentOptions): UseCardFrontExternalLinkFragmentResult => {
  const result = Apollo.useFragment<CardFrontExternalLinkFragment>({
    ...options,
    fragment: CardFrontExternalLinkFragmentDoc,
    fragmentName: 'CardFrontExternalLink',
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

  return { ...result, data: result.data as CardFrontExternalLinkFragment };
};
