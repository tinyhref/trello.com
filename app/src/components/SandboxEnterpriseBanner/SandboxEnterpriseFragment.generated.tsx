import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type SandboxEnterpriseFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id'>
  & { enterprises: Array<(
    { __typename: 'Enterprise' }
    & Pick<Types.Enterprise, 'id' | 'sandbox'>
  )> }
);

export const SandboxEnterpriseFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SandboxEnterprise' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'sandbox' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseSandboxEnterpriseFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      SandboxEnterpriseFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseSandboxEnterpriseFragmentResult
  extends Omit<Apollo.UseFragmentResult<SandboxEnterpriseFragment>, 'data'> {
  data?: SandboxEnterpriseFragment;
}

export const useSandboxEnterpriseFragment = ({
  from,
  returnPartialData,
  ...options
}: UseSandboxEnterpriseFragmentOptions): UseSandboxEnterpriseFragmentResult => {
  const result = Apollo.useFragment<SandboxEnterpriseFragment>({
    ...options,
    fragment: SandboxEnterpriseFragmentDoc,
    fragmentName: 'SandboxEnterprise',
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

  return { ...result, data: result.data as SandboxEnterpriseFragment };
};
