import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardInfoFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id' | 'idBoard' | 'idList'>
);

export const CardInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardInfo' },
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
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardInfoFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<CardInfoFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardInfoFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardInfoFragment>, 'data'> {
  data?: CardInfoFragment;
}

export const useCardInfoFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardInfoFragmentOptions): UseCardInfoFragmentResult => {
  const result = Apollo.useFragment<CardInfoFragment>({
    ...options,
    fragment: CardInfoFragmentDoc,
    fragmentName: 'CardInfo',
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

  return { ...result, data: result.data as CardInfoFragment };
};
