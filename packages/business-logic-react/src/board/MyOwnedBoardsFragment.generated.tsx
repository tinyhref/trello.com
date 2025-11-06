import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MyOwnedBoardsFragment = (
  { __typename: 'Member' }
  & Pick<
    Types.Member,
    | 'id'
    | 'idBoards'
    | 'idEnterprisesAdmin'
    | 'idPremOrgsAdmin'
    | 'memberType'
  >
  & {
    boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'creationMethod' | 'idOrganization'>
      & { memberships: Array<(
        { __typename: 'Board_Membership' }
        & Pick<
          Types.Board_Membership,
          | 'id'
          | 'deactivated'
          | 'idMember'
          | 'memberType'
          | 'unconfirmed'
        >
      )> }
    )>,
    organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'offering'>
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
          & {
            boardDeleteRestrict?: Types.Maybe<(
              { __typename: 'Organization_Prefs_BoardDeleteRestrict' }
              & Pick<
                Types.Organization_Prefs_BoardDeleteRestrict,
                | 'enterprise'
                | 'org'
                | 'private'
                | 'public'
              >
            )>,
            boardVisibilityRestrict?: Types.Maybe<(
              { __typename: 'Organization_Prefs_BoardVisibilityRestrict' }
              & Pick<
                Types.Organization_Prefs_BoardVisibilityRestrict,
                | 'enterprise'
                | 'org'
                | 'private'
                | 'public'
              >
            )>,
          }
        ),
      }
    )>,
  }
);

export const MyOwnedBoardsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MyOwnedBoards' },
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
            name: { kind: 'Name', value: 'boards' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ListValue',
                  values: [
                    { kind: 'EnumValue', value: 'open' },
                    { kind: 'EnumValue', value: 'starred' },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'creationMethod' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idOrganization' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'memberships' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'filter' },
                      value: { kind: 'EnumValue', value: 'me' },
                    },
                  ],
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
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idBoards' } },
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
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'boardVisibilityRestrict',
                        },
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

interface UseMyOwnedBoardsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<MyOwnedBoardsFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMyOwnedBoardsFragmentResult
  extends Omit<Apollo.UseFragmentResult<MyOwnedBoardsFragment>, 'data'> {
  data?: MyOwnedBoardsFragment;
}

export const useMyOwnedBoardsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMyOwnedBoardsFragmentOptions): UseMyOwnedBoardsFragmentResult => {
  const result = Apollo.useFragment<MyOwnedBoardsFragment>({
    ...options,
    fragment: MyOwnedBoardsFragmentDoc,
    fragmentName: 'MyOwnedBoards',
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

  return { ...result, data: result.data as MyOwnedBoardsFragment };
};
