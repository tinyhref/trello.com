import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ViewSwitcherBoardOrganizationFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id'>
  & { organization?: Types.Maybe<(
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
  )> }
);

export const ViewSwitcherBoardOrganizationFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ViewSwitcherBoardOrganization' },
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
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseViewSwitcherBoardOrganizationFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      ViewSwitcherBoardOrganizationFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseViewSwitcherBoardOrganizationFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<ViewSwitcherBoardOrganizationFragment>,
    'data'
  > {
  data?: ViewSwitcherBoardOrganizationFragment;
}

export const useViewSwitcherBoardOrganizationFragment = ({
  from,
  returnPartialData,
  ...options
}: UseViewSwitcherBoardOrganizationFragmentOptions): UseViewSwitcherBoardOrganizationFragmentResult => {
  const result = Apollo.useFragment<ViewSwitcherBoardOrganizationFragment>({
    ...options,
    fragment: ViewSwitcherBoardOrganizationFragmentDoc,
    fragmentName: 'ViewSwitcherBoardOrganization',
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
    data: result.data as ViewSwitcherBoardOrganizationFragment,
  };
};
