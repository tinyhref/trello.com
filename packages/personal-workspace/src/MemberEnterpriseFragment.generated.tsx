import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MemberEnterpriseFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id' | 'confirmed' | 'idEnterprise'>
  & { enterpriseLicenses?: Types.Maybe<Array<(
    { __typename: 'Member_EnterpriseLicense' }
    & Pick<Types.Member_EnterpriseLicense, 'idEnterprise' | 'type'>
  )>> }
);

export const MemberEnterpriseFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MemberEnterprise' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
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
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idEnterprise' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMemberEnterpriseFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MemberEnterpriseFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMemberEnterpriseFragmentResult
  extends Omit<Apollo.UseFragmentResult<MemberEnterpriseFragment>, 'data'> {
  data?: MemberEnterpriseFragment;
}

export const useMemberEnterpriseFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMemberEnterpriseFragmentOptions): UseMemberEnterpriseFragmentResult => {
  const result = Apollo.useFragment<MemberEnterpriseFragment>({
    ...options,
    fragment: MemberEnterpriseFragmentDoc,
    fragmentName: 'MemberEnterprise',
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

  return { ...result, data: result.data as MemberEnterpriseFragment };
};
