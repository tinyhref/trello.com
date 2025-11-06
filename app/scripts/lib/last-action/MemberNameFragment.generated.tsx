import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MemberNameFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id' | 'fullName'>
);

export const MemberNameFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MemberName' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMemberNameFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<MemberNameFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMemberNameFragmentResult
  extends Omit<Apollo.UseFragmentResult<MemberNameFragment>, 'data'> {
  data?: MemberNameFragment;
}

export const useMemberNameFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMemberNameFragmentOptions): UseMemberNameFragmentResult => {
  const result = Apollo.useFragment<MemberNameFragment>({
    ...options,
    fragment: MemberNameFragmentDoc,
    fragmentName: 'MemberName',
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

  return { ...result, data: result.data as MemberNameFragment };
};
