import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardVotesFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id'>
  & { badges: (
    { __typename: 'Card_Badges' }
    & Pick<Types.Card_Badges, 'viewingMemberVoted'>
  ) }
);

export const CardVotesFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardVotes' },
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
            name: { kind: 'Name', value: 'badges' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'viewingMemberVoted' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardVotesFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<CardVotesFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardVotesFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardVotesFragment>, 'data'> {
  data?: CardVotesFragment;
}

export const useCardVotesFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardVotesFragmentOptions): UseCardVotesFragmentResult => {
  const result = Apollo.useFragment<CardVotesFragment>({
    ...options,
    fragment: CardVotesFragmentDoc,
    fragmentName: 'CardVotes',
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

  return { ...result, data: result.data as CardVotesFragment };
};
