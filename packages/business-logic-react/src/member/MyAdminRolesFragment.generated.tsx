import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MyAdminRolesFragment = (
  { __typename: 'Member' }
  & Pick<
    Types.Member,
    | 'id'
    | 'idEnterprisesAdmin'
    | 'idEnterprisesImplicitAdmin'
    | 'idPremOrgsAdmin'
    | 'memberType'
  >
  & { enterprises: Array<(
    { __typename: 'Enterprise' }
    & Pick<Types.Enterprise, 'id' | 'displayName' | 'name'>
  )> }
);

export const MyAdminRolesFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MyAdminRoles' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
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

interface UseMyAdminRolesFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<MyAdminRolesFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMyAdminRolesFragmentResult
  extends Omit<Apollo.UseFragmentResult<MyAdminRolesFragment>, 'data'> {
  data?: MyAdminRolesFragment;
}

export const useMyAdminRolesFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMyAdminRolesFragmentOptions): UseMyAdminRolesFragmentResult => {
  const result = Apollo.useFragment<MyAdminRolesFragment>({
    ...options,
    fragment: MyAdminRolesFragmentDoc,
    fragmentName: 'MyAdminRoles',
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

  return { ...result, data: result.data as MyAdminRolesFragment };
};
