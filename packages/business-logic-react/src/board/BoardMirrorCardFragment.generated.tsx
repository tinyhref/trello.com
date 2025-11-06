import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardMirrorCardFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id' | 'closed' | 'dueComplete'>
);

export const BoardMirrorCardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardMirrorCard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dueComplete' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardMirrorCardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardMirrorCardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardMirrorCardFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardMirrorCardFragment>, 'data'> {
  data?: BoardMirrorCardFragment;
}

export const useBoardMirrorCardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardMirrorCardFragmentOptions): UseBoardMirrorCardFragmentResult => {
  const result = Apollo.useFragment<BoardMirrorCardFragment>({
    ...options,
    fragment: BoardMirrorCardFragmentDoc,
    fragmentName: 'BoardMirrorCard',
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

  return { ...result, data: result.data as BoardMirrorCardFragment };
};
