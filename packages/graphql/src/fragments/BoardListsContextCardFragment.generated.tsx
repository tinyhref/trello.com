import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardListsContextCardFragment = (
  { __typename: 'Card' }
  & Pick<
    Types.Card,
    | 'id'
    | 'cardRole'
    | 'closed'
    | 'dueComplete'
    | 'idBoard'
    | 'idList'
    | 'name'
    | 'pinned'
    | 'pos'
  >
);

export const BoardListsContextCardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardListsContextCard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'cardRole' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dueComplete' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idBoard' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idList' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pinned' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pos' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardListsContextCardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardListsContextCardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardListsContextCardFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<BoardListsContextCardFragment>,
    'data'
  > {
  data?: BoardListsContextCardFragment;
}

export const useBoardListsContextCardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardListsContextCardFragmentOptions): UseBoardListsContextCardFragmentResult => {
  const result = Apollo.useFragment<BoardListsContextCardFragment>({
    ...options,
    fragment: BoardListsContextCardFragmentDoc,
    fragmentName: 'BoardListsContextCard',
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

  return { ...result, data: result.data as BoardListsContextCardFragment };
};
