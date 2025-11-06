import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type IsEmployeeFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'email' | 'idOrganizations'>
);

export const IsEmployeeFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'IsEmployee' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idOrganizations' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseIsEmployeeFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<IsEmployeeFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseIsEmployeeFragmentResult
  extends Omit<Apollo.UseFragmentResult<IsEmployeeFragment>, 'data'> {
  data?: IsEmployeeFragment;
}

export const useIsEmployeeFragment = ({
  from,
  returnPartialData,
  ...options
}: UseIsEmployeeFragmentOptions): UseIsEmployeeFragmentResult => {
  const result = Apollo.useFragment<IsEmployeeFragment>({
    ...options,
    fragment: IsEmployeeFragmentDoc,
    fragmentName: 'IsEmployee',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Member', ...from },
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

  return { ...result, data: result.data as IsEmployeeFragment };
};
