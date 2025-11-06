import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MemberNodeIdFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id' | 'nodeId'>
);

export const MemberNodeIdFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MemberNodeId' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMemberNodeIdFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<MemberNodeIdFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMemberNodeIdFragmentResult
  extends Omit<Apollo.UseFragmentResult<MemberNodeIdFragment>, 'data'> {
  data?: MemberNodeIdFragment;
}

export const useMemberNodeIdFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMemberNodeIdFragmentOptions): UseMemberNodeIdFragmentResult => {
  const result = Apollo.useFragment<MemberNodeIdFragment>({
    ...options,
    fragment: MemberNodeIdFragmentDoc,
    fragmentName: 'MemberNodeId',
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

  return { ...result, data: result.data as MemberNodeIdFragment };
};
