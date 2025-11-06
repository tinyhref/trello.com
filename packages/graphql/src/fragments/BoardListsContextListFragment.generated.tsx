import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardListsContextListFragment = (
  { __typename: 'List' }
  & Pick<
    Types.List,
    | 'id'
    | 'closed'
    | 'name'
    | 'pos'
    | 'type'
  >
);

export const BoardListsContextListFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardListsContextList' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pos' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardListsContextListFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardListsContextListFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardListsContextListFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<BoardListsContextListFragment>,
    'data'
  > {
  data?: BoardListsContextListFragment;
}

export const useBoardListsContextListFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardListsContextListFragmentOptions): UseBoardListsContextListFragmentResult => {
  const result = Apollo.useFragment<BoardListsContextListFragment>({
    ...options,
    fragment: BoardListsContextListFragmentDoc,
    fragmentName: 'BoardListsContextList',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'List', ...from },
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

  return { ...result, data: result.data as BoardListsContextListFragment };
};
