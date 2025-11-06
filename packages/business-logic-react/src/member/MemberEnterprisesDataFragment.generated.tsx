import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MemberEnterprisesDataFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id' | 'hasEnterpriseDomain' | 'idEnterprise'>
  & { enterprises: Array<(
    { __typename: 'Enterprise' }
    & Pick<Types.Enterprise, 'id' | 'offering'>
  )> }
);

export const MemberEnterprisesDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MemberEnterprisesData' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'offering' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'hasEnterpriseDomain' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idEnterprise' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMemberEnterprisesDataFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MemberEnterprisesDataFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMemberEnterprisesDataFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<MemberEnterprisesDataFragment>,
    'data'
  > {
  data?: MemberEnterprisesDataFragment;
}

export const useMemberEnterprisesDataFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMemberEnterprisesDataFragmentOptions): UseMemberEnterprisesDataFragmentResult => {
  const result = Apollo.useFragment<MemberEnterprisesDataFragment>({
    ...options,
    fragment: MemberEnterprisesDataFragmentDoc,
    fragmentName: 'MemberEnterprisesData',
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

  return { ...result, data: result.data as MemberEnterprisesDataFragment };
};
