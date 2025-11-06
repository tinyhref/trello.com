import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MemberAvatarFragment = (
  { __typename: 'Member' }
  & Pick<
    Types.Member,
    | 'id'
    | 'avatarUrl'
    | 'fullName'
    | 'initials'
    | 'username'
  >
  & { nonPublic?: Types.Maybe<(
    { __typename: 'Member_NonPublic' }
    & Pick<Types.Member_NonPublic, 'avatarUrl' | 'fullName' | 'initials'>
  )> }
);

export const MemberAvatarFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MemberAvatar' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'avatarUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'initials' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'nonPublic' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'avatarUrl' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'initials' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'username' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMemberAvatarFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<MemberAvatarFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMemberAvatarFragmentResult
  extends Omit<Apollo.UseFragmentResult<MemberAvatarFragment>, 'data'> {
  data?: MemberAvatarFragment;
}

export const useMemberAvatarFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMemberAvatarFragmentOptions): UseMemberAvatarFragmentResult => {
  const result = Apollo.useFragment<MemberAvatarFragment>({
    ...options,
    fragment: MemberAvatarFragmentDoc,
    fragmentName: 'MemberAvatar',
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

  return { ...result, data: result.data as MemberAvatarFragment };
};
