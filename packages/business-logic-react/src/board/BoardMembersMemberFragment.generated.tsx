import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardMembersMemberFragment = (
  { __typename: 'Member' }
  & Pick<
    Types.Member,
    | 'id'
    | 'idEnterprisesAdmin'
    | 'idPremOrgsAdmin'
    | 'memberType'
  >
  & {
    enterpriseLicenses?: Types.Maybe<Array<(
      { __typename: 'Member_EnterpriseLicense' }
      & Pick<Types.Member_EnterpriseLicense, 'idEnterprise'>
    )>>,
    organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'idEnterprise'>
    )>,
  }
);

export const BoardMembersMemberFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardMembersMember' },
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
            name: { kind: 'Name', value: 'idEnterprisesAdmin' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idPremOrgsAdmin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberType' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'organizations' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idEnterprise' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardMembersMemberFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardMembersMemberFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardMembersMemberFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardMembersMemberFragment>, 'data'> {
  data?: BoardMembersMemberFragment;
}

export const useBoardMembersMemberFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardMembersMemberFragmentOptions): UseBoardMembersMemberFragmentResult => {
  const result = Apollo.useFragment<BoardMembersMemberFragment>({
    ...options,
    fragment: BoardMembersMemberFragmentDoc,
    fragmentName: 'BoardMembersMember',
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

  return { ...result, data: result.data as BoardMembersMemberFragment };
};
