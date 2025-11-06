import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardFrontMembersFragment = (
  { __typename: 'Card' }
  & Pick<
    Types.Card,
    | 'id'
    | 'idBoard'
    | 'idList'
    | 'idMembers'
  >
);

export const CardFrontMembersFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardFrontMembers' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'idMembers' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardFrontMembersFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardFrontMembersFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardFrontMembersFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardFrontMembersFragment>, 'data'> {
  data?: CardFrontMembersFragment;
}

export const useCardFrontMembersFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardFrontMembersFragmentOptions): UseCardFrontMembersFragmentResult => {
  const result = Apollo.useFragment<CardFrontMembersFragment>({
    ...options,
    fragment: CardFrontMembersFragmentDoc,
    fragmentName: 'CardFrontMembers',
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

  return { ...result, data: result.data as CardFrontMembersFragment };
};
