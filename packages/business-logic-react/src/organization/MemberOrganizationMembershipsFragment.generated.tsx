import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MemberOrganizationMembershipsFragment = (
  { __typename: 'Member' }
  & Pick<
    Types.Member,
    | 'id'
    | 'idEnterprisesAdmin'
    | 'idEnterprisesImplicitAdmin'
    | 'idPremOrgsAdmin'
    | 'memberType'
  >
);

export const MemberOrganizationMembershipsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MemberOrganizationMemberships' },
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
            name: { kind: 'Name', value: 'idEnterprisesAdmin' },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'idEnterprisesImplicitAdmin' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idPremOrgsAdmin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberType' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMemberOrganizationMembershipsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MemberOrganizationMembershipsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMemberOrganizationMembershipsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<MemberOrganizationMembershipsFragment>,
    'data'
  > {
  data?: MemberOrganizationMembershipsFragment;
}

export const useMemberOrganizationMembershipsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMemberOrganizationMembershipsFragmentOptions): UseMemberOrganizationMembershipsFragmentResult => {
  const result = Apollo.useFragment<MemberOrganizationMembershipsFragment>({
    ...options,
    fragment: MemberOrganizationMembershipsFragmentDoc,
    fragmentName: 'MemberOrganizationMemberships',
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

  return {
    ...result,
    data: result.data as MemberOrganizationMembershipsFragment,
  };
};
