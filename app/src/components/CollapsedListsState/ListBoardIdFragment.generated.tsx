import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ListBoardIdFragment = (
  { __typename: 'List' }
  & Pick<Types.List, 'id' | 'idBoard'>
);

export const ListBoardIdFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ListBoardId' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idBoard' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseListBoardIdFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<ListBoardIdFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseListBoardIdFragmentResult
  extends Omit<Apollo.UseFragmentResult<ListBoardIdFragment>, 'data'> {
  data?: ListBoardIdFragment;
}

export const useListBoardIdFragment = ({
  from,
  returnPartialData,
  ...options
}: UseListBoardIdFragmentOptions): UseListBoardIdFragmentResult => {
  const result = Apollo.useFragment<ListBoardIdFragment>({
    ...options,
    fragment: ListBoardIdFragmentDoc,
    fragmentName: 'ListBoardId',
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

  return { ...result, data: result.data as ListBoardIdFragment };
};
