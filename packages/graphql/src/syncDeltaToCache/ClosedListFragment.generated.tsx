import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ClosedListFragment = (
  { __typename: 'List' }
  & Pick<Types.List, 'closed'>
);

export const ClosedListFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ClosedList' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseClosedListFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<ClosedListFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseClosedListFragmentResult
  extends Omit<Apollo.UseFragmentResult<ClosedListFragment>, 'data'> {
  data?: ClosedListFragment;
}

export const useClosedListFragment = ({
  from,
  returnPartialData,
  ...options
}: UseClosedListFragmentOptions): UseClosedListFragmentResult => {
  const result = Apollo.useFragment<ClosedListFragment>({
    ...options,
    fragment: ClosedListFragmentDoc,
    fragmentName: 'ClosedList',
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

  return { ...result, data: result.data as ClosedListFragment };
};
