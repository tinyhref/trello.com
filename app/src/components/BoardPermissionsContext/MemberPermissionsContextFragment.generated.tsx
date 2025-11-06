import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MemberPermissionsContextFragment = (
  { __typename: 'Member' }
  & Pick<
    Types.Member,
    | 'id'
    | 'confirmed'
    | 'idEnterprise'
    | 'idEnterprisesAdmin'
    | 'idPremOrgsAdmin'
    | 'memberType'
  >
);

export const MemberPermissionsContextFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MemberPermissionsContext' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idEnterprise' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'idEnterprisesAdmin' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idPremOrgsAdmin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberType' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMemberPermissionsContextFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MemberPermissionsContextFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMemberPermissionsContextFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<MemberPermissionsContextFragment>,
    'data'
  > {
  data?: MemberPermissionsContextFragment;
}

export const useMemberPermissionsContextFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMemberPermissionsContextFragmentOptions): UseMemberPermissionsContextFragmentResult => {
  const result = Apollo.useFragment<MemberPermissionsContextFragment>({
    ...options,
    fragment: MemberPermissionsContextFragmentDoc,
    fragmentName: 'MemberPermissionsContext',
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

  return { ...result, data: result.data as MemberPermissionsContextFragment };
};
