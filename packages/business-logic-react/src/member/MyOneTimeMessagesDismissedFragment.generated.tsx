import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MyOneTimeMessagesDismissedFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
);

export const MyOneTimeMessagesDismissedFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MyOneTimeMessagesDismissed' },
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
            name: { kind: 'Name', value: 'oneTimeMessagesDismissed' },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMyOneTimeMessagesDismissedFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MyOneTimeMessagesDismissedFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMyOneTimeMessagesDismissedFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<MyOneTimeMessagesDismissedFragment>,
    'data'
  > {
  data?: MyOneTimeMessagesDismissedFragment;
}

export const useMyOneTimeMessagesDismissedFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMyOneTimeMessagesDismissedFragmentOptions): UseMyOneTimeMessagesDismissedFragmentResult => {
  const result = Apollo.useFragment<MyOneTimeMessagesDismissedFragment>({
    ...options,
    fragment: MyOneTimeMessagesDismissedFragmentDoc,
    fragmentName: 'MyOneTimeMessagesDismissed',
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

  return { ...result, data: result.data as MyOneTimeMessagesDismissedFragment };
};
