import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardDueCompleteFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id' | 'dueComplete'>
);

export const CardDueCompleteFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardDueComplete' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dueComplete' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardDueCompleteFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardDueCompleteFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardDueCompleteFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardDueCompleteFragment>, 'data'> {
  data?: CardDueCompleteFragment;
}

export const useCardDueCompleteFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardDueCompleteFragmentOptions): UseCardDueCompleteFragmentResult => {
  const result = Apollo.useFragment<CardDueCompleteFragment>({
    ...options,
    fragment: CardDueCompleteFragmentDoc,
    fragmentName: 'CardDueComplete',
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

  return { ...result, data: result.data as CardDueCompleteFragment };
};
