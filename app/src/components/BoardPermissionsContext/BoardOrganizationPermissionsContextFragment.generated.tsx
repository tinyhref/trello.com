import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardOrganizationPermissionsContextFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id'>
  & { organization?: Types.Maybe<(
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
      prefs: (
        { __typename: 'Organization_Prefs' }
        & { boardDeleteRestrict?: Types.Maybe<(
          { __typename: 'Organization_Prefs_BoardDeleteRestrict' }
          & Pick<
            Types.Organization_Prefs_BoardDeleteRestrict,
            | 'enterprise'
            | 'org'
            | 'private'
            | 'public'
          >
        )> }
      ),
    }
  )> }
);

export const BoardOrganizationPermissionsContextFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardOrganizationPermissionsContext' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'organization' },
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'idAdmins' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idEnterprise' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'memberships' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deactivated' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'idMember' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'memberType' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'unconfirmed' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'offering' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'prefs' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'boardDeleteRestrict' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'enterprise' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'org' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'private' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'public' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardOrganizationPermissionsContextFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardOrganizationPermissionsContextFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardOrganizationPermissionsContextFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<BoardOrganizationPermissionsContextFragment>,
    'data'
  > {
  data?: BoardOrganizationPermissionsContextFragment;
}

export const useBoardOrganizationPermissionsContextFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardOrganizationPermissionsContextFragmentOptions): UseBoardOrganizationPermissionsContextFragmentResult => {
  const result =
    Apollo.useFragment<BoardOrganizationPermissionsContextFragment>({
      ...options,
      fragment: BoardOrganizationPermissionsContextFragmentDoc,
      fragmentName: 'BoardOrganizationPermissionsContext',
      from:
        !from || !(from as Apollo.StoreObject)?.id
          ? null
          : { __typename: 'Board', ...from },
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
    data: result.data as BoardOrganizationPermissionsContextFragment,
  };
};
