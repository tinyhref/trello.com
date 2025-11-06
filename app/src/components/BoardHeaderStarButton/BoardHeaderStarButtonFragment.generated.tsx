import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardHeaderStarButtonFragment = (
  { __typename: 'Member' }
  & { boardStars: Array<(
    { __typename: 'BoardStar' }
    & Pick<Types.BoardStar, 'id' | 'idBoard' | 'pos'>
  )> }
);

export const BoardHeaderStarButtonFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardHeaderStarButton' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'boardStars' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idBoard' } },
                { kind: 'Field', name: { kind: 'Name', value: 'pos' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardHeaderStarButtonFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardHeaderStarButtonFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardHeaderStarButtonFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<BoardHeaderStarButtonFragment>,
    'data'
  > {
  data?: BoardHeaderStarButtonFragment;
}

export const useBoardHeaderStarButtonFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardHeaderStarButtonFragmentOptions): UseBoardHeaderStarButtonFragmentResult => {
  const result = Apollo.useFragment<BoardHeaderStarButtonFragment>({
    ...options,
    fragment: BoardHeaderStarButtonFragmentDoc,
    fragmentName: 'BoardHeaderStarButton',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Member', ...from },
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

  return { ...result, data: result.data as BoardHeaderStarButtonFragment };
};
