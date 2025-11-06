import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ListLimitsPowerUpFragment = (
  { __typename: 'List' }
  & Pick<Types.List, 'id' | 'softLimit'>
);

export const ListLimitsPowerUpFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ListLimitsPowerUp' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'softLimit' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseListLimitsPowerUpFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      ListLimitsPowerUpFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseListLimitsPowerUpFragmentResult
  extends Omit<Apollo.UseFragmentResult<ListLimitsPowerUpFragment>, 'data'> {
  data?: ListLimitsPowerUpFragment;
}

export const useListLimitsPowerUpFragment = ({
  from,
  returnPartialData,
  ...options
}: UseListLimitsPowerUpFragmentOptions): UseListLimitsPowerUpFragmentResult => {
  const result = Apollo.useFragment<ListLimitsPowerUpFragment>({
    ...options,
    fragment: ListLimitsPowerUpFragmentDoc,
    fragmentName: 'ListLimitsPowerUp',
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

  return { ...result, data: result.data as ListLimitsPowerUpFragment };
};
