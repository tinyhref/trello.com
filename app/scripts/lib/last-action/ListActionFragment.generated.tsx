import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ListActionFragment = (
  { __typename: 'List' }
  & Pick<Types.List, 'id' | 'closed' | 'idBoard'>
);

export const ListActionFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ListAction' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idBoard' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseListActionFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<ListActionFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseListActionFragmentResult
  extends Omit<Apollo.UseFragmentResult<ListActionFragment>, 'data'> {
  data?: ListActionFragment;
}

export const useListActionFragment = ({
  from,
  returnPartialData,
  ...options
}: UseListActionFragmentOptions): UseListActionFragmentResult => {
  const result = Apollo.useFragment<ListActionFragment>({
    ...options,
    fragment: ListActionFragmentDoc,
    fragmentName: 'ListAction',
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

  return { ...result, data: result.data as ListActionFragment };
};
