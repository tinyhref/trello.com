import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardPermissionsContextFragment = (
  { __typename: 'Board' }
  & Pick<
    Types.Board,
    | 'id'
    | 'closed'
    | 'enterpriseOwned'
    | 'idEnterprise'
    | 'idOrganization'
    | 'premiumFeatures'
  >
  & {
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
    prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<
        Types.Board_Prefs,
        | 'comments'
        | 'isTemplate'
        | 'permissionLevel'
        | 'selfJoin'
        | 'voting'
      >
    )>,
  }
);

export const BoardPermissionsContextFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardPermissionsContext' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enterpriseOwned' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idEnterprise' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idOrganization' } },
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
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'comments' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'permissionLevel' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'selfJoin' } },
                { kind: 'Field', name: { kind: 'Name', value: 'voting' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'premiumFeatures' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardPermissionsContextFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardPermissionsContextFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardPermissionsContextFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<BoardPermissionsContextFragment>,
    'data'
  > {
  data?: BoardPermissionsContextFragment;
}

export const useBoardPermissionsContextFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardPermissionsContextFragmentOptions): UseBoardPermissionsContextFragmentResult => {
  const result = Apollo.useFragment<BoardPermissionsContextFragment>({
    ...options,
    fragment: BoardPermissionsContextFragmentDoc,
    fragmentName: 'BoardPermissionsContext',
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

  return { ...result, data: result.data as BoardPermissionsContextFragment };
};
