import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardMembersFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'idEnterprise' | 'idOrganization'>
  & {
    members: Array<(
      { __typename: 'Member' }
      & Pick<
        Types.Member,
        | 'id'
        | 'activityBlocked'
        | 'avatarUrl'
        | 'bio'
        | 'bioData'
        | 'confirmed'
        | 'fullName'
        | 'idEnterprise'
        | 'idMemberReferrer'
        | 'idPremOrgsAdmin'
        | 'initials'
        | 'memberType'
        | 'nonPublicAvailable'
        | 'url'
        | 'username'
      >
      & { nonPublic?: Types.Maybe<(
        { __typename: 'Member_NonPublic' }
        & Pick<Types.Member_NonPublic, 'avatarUrl' | 'fullName' | 'initials'>
      )> }
    )>,
    memberships: Array<(
      { __typename: 'Board_Membership' }
      & Pick<
        Types.Board_Membership,
        | 'id'
        | 'deactivated'
        | 'idMember'
        | 'memberType'
        | 'orgMemberType'
        | 'unconfirmed'
      >
    )>,
    organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'offering'>
      & { memberships: Array<(
        { __typename: 'Organization_Membership' }
        & Pick<
          Types.Organization_Membership,
          | 'id'
          | 'deactivated'
          | 'idMember'
          | 'memberType'
          | 'unconfirmed'
        >
      )> }
    )>,
    prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'canInvite' | 'invitations' | 'permissionLevel'>
    )>,
  }
);

export const BoardMembersFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardMembers' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idEnterprise' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idOrganization' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'members' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'activityBlocked' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'avatarUrl' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bioData' } },
                { kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idEnterprise' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idMemberReferrer' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idPremOrgsAdmin' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'initials' } },
                { kind: 'Field', name: { kind: 'Name', value: 'memberType' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nonPublic' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avatarUrl' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fullName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'initials' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nonPublicAvailable' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                { kind: 'Field', name: { kind: 'Name', value: 'username' } },
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
                { kind: 'Field', name: { kind: 'Name', value: 'deactivated' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idMember' } },
                { kind: 'Field', name: { kind: 'Name', value: 'memberType' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'orgMemberType' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'unconfirmed' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'organization' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
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
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'canInvite' } },
                { kind: 'Field', name: { kind: 'Name', value: 'invitations' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'permissionLevel' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardMembersFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<BoardMembersFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardMembersFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardMembersFragment>, 'data'> {
  data?: BoardMembersFragment;
}

export const useBoardMembersFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardMembersFragmentOptions): UseBoardMembersFragmentResult => {
  const result = Apollo.useFragment<BoardMembersFragment>({
    ...options,
    fragment: BoardMembersFragmentDoc,
    fragmentName: 'BoardMembers',
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

  return { ...result, data: result.data as BoardMembersFragment };
};
