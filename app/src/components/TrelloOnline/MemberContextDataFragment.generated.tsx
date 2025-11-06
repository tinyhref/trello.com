import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MemberContextDataFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id' | 'username'>
  & {
    logins: Array<(
      { __typename: 'Login' }
      & Pick<Types.Login, 'id' | 'claimable'>
    )>,
    organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'offering'>
    )>,
  }
);

export const MemberContextDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MemberContextData' },
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
            name: { kind: 'Name', value: 'logins' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'claimable' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'organizations' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'offering' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'username' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMemberContextDataFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MemberContextDataFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMemberContextDataFragmentResult
  extends Omit<Apollo.UseFragmentResult<MemberContextDataFragment>, 'data'> {
  data?: MemberContextDataFragment;
}

export const useMemberContextDataFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMemberContextDataFragmentOptions): UseMemberContextDataFragmentResult => {
  const result = Apollo.useFragment<MemberContextDataFragment>({
    ...options,
    fragment: MemberContextDataFragmentDoc,
    fragmentName: 'MemberContextData',
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

  return { ...result, data: result.data as MemberContextDataFragment };
};
