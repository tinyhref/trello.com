import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardTypeFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'type'>
);

export const BoardTypeFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardType' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'type' } }],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardTypeFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<BoardTypeFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardTypeFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardTypeFragment>, 'data'> {
  data?: BoardTypeFragment;
}

export const useBoardTypeFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardTypeFragmentOptions): UseBoardTypeFragmentResult => {
  const result = Apollo.useFragment<BoardTypeFragment>({
    ...options,
    fragment: BoardTypeFragmentDoc,
    fragmentName: 'BoardType',
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

  return { ...result, data: result.data as BoardTypeFragment };
};
