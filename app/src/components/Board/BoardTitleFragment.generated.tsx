import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardTitleFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'name'>
);

export const BoardTitleFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardTitle' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardTitleFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<BoardTitleFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardTitleFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardTitleFragment>, 'data'> {
  data?: BoardTitleFragment;
}

export const useBoardTitleFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardTitleFragmentOptions): UseBoardTitleFragmentResult => {
  const result = Apollo.useFragment<BoardTitleFragment>({
    ...options,
    fragment: BoardTitleFragmentDoc,
    fragmentName: 'BoardTitle',
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

  return { ...result, data: result.data as BoardTitleFragment };
};
