import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardOpenListsFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'name'>
  & { lists: Array<(
    { __typename: 'List' }
    & Pick<Types.List, 'id' | 'pos'>
  )> }
);

export const BoardOpenListsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardOpenLists' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lists' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'EnumValue', value: 'open' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'pos' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardOpenListsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardOpenListsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardOpenListsFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardOpenListsFragment>, 'data'> {
  data?: BoardOpenListsFragment;
}

export const useBoardOpenListsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardOpenListsFragmentOptions): UseBoardOpenListsFragmentResult => {
  const result = Apollo.useFragment<BoardOpenListsFragment>({
    ...options,
    fragment: BoardOpenListsFragmentDoc,
    fragmentName: 'BoardOpenLists',
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

  return { ...result, data: result.data as BoardOpenListsFragment };
};
