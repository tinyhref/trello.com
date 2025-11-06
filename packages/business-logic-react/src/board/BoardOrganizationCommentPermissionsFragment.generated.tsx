import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardOrganizationCommentPermissionsFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id'>
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'offering'>
    & { limits: (
      { __typename: 'Organization_Limits' }
      & { orgs: (
        { __typename: 'Organization_Limits_Orgs' }
        & { usersPerFreeOrg: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'status'>
        ) }
      ) }
    ) }
  )> }
);

export const BoardOrganizationCommentPermissionsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardOrganizationCommentPermissions' },
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
                  name: { kind: 'Name', value: 'limits' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'orgs' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'usersPerFreeOrg' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'offering' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardOrganizationCommentPermissionsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardOrganizationCommentPermissionsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardOrganizationCommentPermissionsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<BoardOrganizationCommentPermissionsFragment>,
    'data'
  > {
  data?: BoardOrganizationCommentPermissionsFragment;
}

export const useBoardOrganizationCommentPermissionsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardOrganizationCommentPermissionsFragmentOptions): UseBoardOrganizationCommentPermissionsFragmentResult => {
  const result =
    Apollo.useFragment<BoardOrganizationCommentPermissionsFragment>({
      ...options,
      fragment: BoardOrganizationCommentPermissionsFragmentDoc,
      fragmentName: 'BoardOrganizationCommentPermissions',
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
    data: result.data as BoardOrganizationCommentPermissionsFragment,
  };
};
