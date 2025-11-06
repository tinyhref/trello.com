import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardNameFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'name'>
);

export const BoardNameFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardName' },
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

interface UseBoardNameFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<BoardNameFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardNameFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardNameFragment>, 'data'> {
  data?: BoardNameFragment;
}

export const useBoardNameFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardNameFragmentOptions): UseBoardNameFragmentResult => {
  const result = Apollo.useFragment<BoardNameFragment>({
    ...options,
    fragment: BoardNameFragmentDoc,
    fragmentName: 'BoardName',
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

  return { ...result, data: result.data as BoardNameFragment };
};
