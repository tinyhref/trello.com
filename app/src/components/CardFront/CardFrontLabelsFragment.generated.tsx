import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardFrontLabelsFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id' | 'idBoard' | 'idList'>
  & { labels: Array<(
    { __typename: 'Label' }
    & Pick<Types.Label, 'id' | 'color' | 'name'>
  )> }
);

export const CardFrontLabelsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardFrontLabels' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idBoard' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idList' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'labels' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardFrontLabelsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardFrontLabelsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardFrontLabelsFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardFrontLabelsFragment>, 'data'> {
  data?: CardFrontLabelsFragment;
}

export const useCardFrontLabelsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardFrontLabelsFragmentOptions): UseCardFrontLabelsFragmentResult => {
  const result = Apollo.useFragment<CardFrontLabelsFragment>({
    ...options,
    fragment: CardFrontLabelsFragmentDoc,
    fragmentName: 'CardFrontLabels',
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

  return { ...result, data: result.data as CardFrontLabelsFragment };
};
