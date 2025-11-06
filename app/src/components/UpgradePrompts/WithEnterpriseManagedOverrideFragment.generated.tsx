import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type WithEnterpriseManagedOverrideEnterpriseFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'idEnterprise'>
  & {
    enterpriseLicenses?: Types.Maybe<Array<(
      { __typename: 'Member_EnterpriseLicense' }
      & Pick<Types.Member_EnterpriseLicense, 'idEnterprise'>
    )>>,
    enterprises: Array<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id' | 'offering'>
    )>,
  }
);

export const WithEnterpriseManagedOverrideEnterpriseFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WithEnterpriseManagedOverrideEnterprise' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'enterpriseLicenses' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idEnterprise' },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'enterprises' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ListValue',
                  values: [
                    { kind: 'EnumValue', value: 'saml' },
                    { kind: 'EnumValue', value: 'member' },
                    { kind: 'EnumValue', value: 'memberUnconfirmed' },
                    { kind: 'EnumValue', value: 'owned' },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'offering' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idEnterprise' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseWithEnterpriseManagedOverrideEnterpriseFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      WithEnterpriseManagedOverrideEnterpriseFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseWithEnterpriseManagedOverrideEnterpriseFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<WithEnterpriseManagedOverrideEnterpriseFragment>,
    'data'
  > {
  data?: WithEnterpriseManagedOverrideEnterpriseFragment;
}

export const useWithEnterpriseManagedOverrideEnterpriseFragment = ({
  from,
  returnPartialData,
  ...options
}: UseWithEnterpriseManagedOverrideEnterpriseFragmentOptions): UseWithEnterpriseManagedOverrideEnterpriseFragmentResult => {
  const result =
    Apollo.useFragment<WithEnterpriseManagedOverrideEnterpriseFragment>({
      ...options,
      fragment: WithEnterpriseManagedOverrideEnterpriseFragmentDoc,
      fragmentName: 'WithEnterpriseManagedOverrideEnterprise',
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
    data: result.data as WithEnterpriseManagedOverrideEnterpriseFragment,
  };
};
