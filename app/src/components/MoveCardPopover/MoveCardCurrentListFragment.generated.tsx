import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MoveCardCurrentListFragment = (
  { __typename: 'List' }
  & Pick<Types.List, 'id' | 'name' | 'pos'>
);

export const MoveCardCurrentListFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MoveCardCurrentList' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pos' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMoveCardCurrentListFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MoveCardCurrentListFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMoveCardCurrentListFragmentResult
  extends Omit<Apollo.UseFragmentResult<MoveCardCurrentListFragment>, 'data'> {
  data?: MoveCardCurrentListFragment;
}

export const useMoveCardCurrentListFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMoveCardCurrentListFragmentOptions): UseMoveCardCurrentListFragmentResult => {
  const result = Apollo.useFragment<MoveCardCurrentListFragment>({
    ...options,
    fragment: MoveCardCurrentListFragmentDoc,
    fragmentName: 'MoveCardCurrentList',
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

  return { ...result, data: result.data as MoveCardCurrentListFragment };
};
