import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ListColorFragment = (
  { __typename: 'List' }
  & Pick<Types.List, 'id' | 'color'>
);

export const ListColorFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ListColor' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseListColorFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<ListColorFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseListColorFragmentResult
  extends Omit<Apollo.UseFragmentResult<ListColorFragment>, 'data'> {
  data?: ListColorFragment;
}

export const useListColorFragment = ({
  from,
  returnPartialData,
  ...options
}: UseListColorFragmentOptions): UseListColorFragmentResult => {
  const result = Apollo.useFragment<ListColorFragment>({
    ...options,
    fragment: ListColorFragmentDoc,
    fragmentName: 'ListColor',
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

  return { ...result, data: result.data as ListColorFragment };
};
