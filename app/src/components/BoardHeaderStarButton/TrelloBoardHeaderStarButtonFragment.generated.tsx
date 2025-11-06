import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloBoardHeaderStarButtonFragment = (
  { __typename: 'TrelloMember' }
  & { boardStars?: Types.Maybe<(
    { __typename: 'TrelloMemberBoardStarConnection' }
    & { edges?: Types.Maybe<Array<(
      { __typename: 'TrelloMemberBoardStarEdge' }
      & Pick<
        Types.TrelloMemberBoardStarEdge,
        | 'id'
        | 'boardObjectId'
        | 'objectId'
        | 'position'
      >
    )>> }
  )> }
);

export const TrelloBoardHeaderStarButtonFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloBoardHeaderStarButton' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloMember' },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'boardObjectId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'objectId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'position' },
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

interface UseTrelloBoardHeaderStarButtonFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloBoardHeaderStarButtonFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloBoardHeaderStarButtonFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloBoardHeaderStarButtonFragment>,
    'data'
  > {
  data?: TrelloBoardHeaderStarButtonFragment;
}

export const useTrelloBoardHeaderStarButtonFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloBoardHeaderStarButtonFragmentOptions): UseTrelloBoardHeaderStarButtonFragmentResult => {
  const result = Apollo.useFragment<TrelloBoardHeaderStarButtonFragment>({
    ...options,
    fragment: TrelloBoardHeaderStarButtonFragmentDoc,
    fragmentName: 'TrelloBoardHeaderStarButton',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloMember', ...from },
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

  return {
    ...result,
    data: result.data as TrelloBoardHeaderStarButtonFragment,
  };
};
