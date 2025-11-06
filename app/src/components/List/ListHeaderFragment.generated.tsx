import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ListHeaderFragment = (
  { __typename: 'List' }
  & Pick<Types.List, 'id' | 'subscribed'>
);

export const ListHeaderFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ListHeader' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subscribed' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseListHeaderFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<ListHeaderFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseListHeaderFragmentResult
  extends Omit<Apollo.UseFragmentResult<ListHeaderFragment>, 'data'> {
  data?: ListHeaderFragment;
}

export const useListHeaderFragment = ({
  from,
  returnPartialData,
  ...options
}: UseListHeaderFragmentOptions): UseListHeaderFragmentResult => {
  const result = Apollo.useFragment<ListHeaderFragment>({
    ...options,
    fragment: ListHeaderFragmentDoc,
    fragmentName: 'ListHeader',
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

  return { ...result, data: result.data as ListHeaderFragment };
};
