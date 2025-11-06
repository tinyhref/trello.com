import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type OrganizationMembershipsFragment = (
  { __typename: 'Organization' }
  & Pick<Types.Organization, 'id' | 'idEnterprise' | 'offering'>
  & {
    enterprise?: Types.Maybe<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id' | 'idAdmins'>
    )>,
    memberships: Array<(
      { __typename: 'Organization_Membership' }
      & Pick<
        Types.Organization_Membership,
        | 'id'
        | 'deactivated'
        | 'idMember'
        | 'memberType'
        | 'unconfirmed'
      >
    )>,
  }
);

export const OrganizationMembershipsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrganizationMemberships' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Organization' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'enterprise' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idAdmins' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idEnterprise' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'memberships' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deactivated' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idMember' } },
                { kind: 'Field', name: { kind: 'Name', value: 'memberType' } },
                { kind: 'Field', name: { kind: 'Name', value: 'unconfirmed' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'offering' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseOrganizationMembershipsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      OrganizationMembershipsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseOrganizationMembershipsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<OrganizationMembershipsFragment>,
    'data'
  > {
  data?: OrganizationMembershipsFragment;
}

export const useOrganizationMembershipsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseOrganizationMembershipsFragmentOptions): UseOrganizationMembershipsFragmentResult => {
  const result = Apollo.useFragment<OrganizationMembershipsFragment>({
    ...options,
    fragment: OrganizationMembershipsFragmentDoc,
    fragmentName: 'OrganizationMemberships',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Organization', ...from },
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

  return { ...result, data: result.data as OrganizationMembershipsFragment };
};
