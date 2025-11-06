import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MemberCustomAttributesFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id' | 'email' | 'premiumFeatures'>
  & {
    logins: Array<(
      { __typename: 'Login' }
      & Pick<Types.Login, 'id' | 'claimable'>
    )>,
    organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'premiumFeatures'>
    )>,
  }
);

export const MemberCustomAttributesFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MemberCustomAttributes' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'premiumFeatures' },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'premiumFeatures' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMemberCustomAttributesFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MemberCustomAttributesFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMemberCustomAttributesFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<MemberCustomAttributesFragment>,
    'data'
  > {
  data?: MemberCustomAttributesFragment;
}

export const useMemberCustomAttributesFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMemberCustomAttributesFragmentOptions): UseMemberCustomAttributesFragmentResult => {
  const result = Apollo.useFragment<MemberCustomAttributesFragment>({
    ...options,
    fragment: MemberCustomAttributesFragmentDoc,
    fragmentName: 'MemberCustomAttributes',
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

  return { ...result, data: result.data as MemberCustomAttributesFragment };
};
