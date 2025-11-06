import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type NewUserFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id'>
  & { campaigns: Array<(
    { __typename: 'Campaign' }
    & Pick<Types.Campaign, 'id' | 'dateDismissed' | 'name'>
  )> }
);

export const NewUserFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'NewUser' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'campaigns' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'dateDismissed' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseNewUserFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<NewUserFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseNewUserFragmentResult
  extends Omit<Apollo.UseFragmentResult<NewUserFragment>, 'data'> {
  data?: NewUserFragment;
}

export const useNewUserFragment = ({
  from,
  returnPartialData,
  ...options
}: UseNewUserFragmentOptions): UseNewUserFragmentResult => {
  const result = Apollo.useFragment<NewUserFragment>({
    ...options,
    fragment: NewUserFragmentDoc,
    fragmentName: 'NewUser',
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

  return { ...result, data: result.data as NewUserFragment };
};
