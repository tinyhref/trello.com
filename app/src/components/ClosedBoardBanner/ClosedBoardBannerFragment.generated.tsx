import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ClosedBoardBannerFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'closed' | 'idOrganization'>
  & {
    memberships: Array<(
      { __typename: 'Board_Membership' }
      & Pick<
        Types.Board_Membership,
        | 'id'
        | 'deactivated'
        | 'idMember'
        | 'memberType'
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
  }
);

export const ClosedBoardBannerFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ClosedBoardBanner' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
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
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseClosedBoardBannerFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      ClosedBoardBannerFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseClosedBoardBannerFragmentResult
  extends Omit<Apollo.UseFragmentResult<ClosedBoardBannerFragment>, 'data'> {
  data?: ClosedBoardBannerFragment;
}

export const useClosedBoardBannerFragment = ({
  from,
  returnPartialData,
  ...options
}: UseClosedBoardBannerFragmentOptions): UseClosedBoardBannerFragmentResult => {
  const result = Apollo.useFragment<ClosedBoardBannerFragment>({
    ...options,
    fragment: ClosedBoardBannerFragmentDoc,
    fragmentName: 'ClosedBoardBanner',
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

  return { ...result, data: result.data as ClosedBoardBannerFragment };
};
