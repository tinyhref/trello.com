import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type AddGuestWorkspaceDetailsFragment = (
  { __typename: 'Organization' }
  & Pick<Types.Organization, 'id' | 'displayName' | 'offering'>
  & {
    limits: (
      { __typename: 'Organization_Limits' }
      & { orgs: (
        { __typename: 'Organization_Limits_Orgs' }
        & { totalMembersPerOrg: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status'>
        ) }
      ) }
    ),
    prefs: (
      { __typename: 'Organization_Prefs' }
      & Pick<Types.Organization_Prefs, 'newLicenseInviteRestrictUrl'>
    ),
  }
);

export const AddGuestWorkspaceDetailsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AddGuestWorkspaceDetails' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Organization' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
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
                        name: { kind: 'Name', value: 'totalMembersPerOrg' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'disableAt' },
                            },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'newLicenseInviteRestrictUrl' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseAddGuestWorkspaceDetailsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      AddGuestWorkspaceDetailsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseAddGuestWorkspaceDetailsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<AddGuestWorkspaceDetailsFragment>,
    'data'
  > {
  data?: AddGuestWorkspaceDetailsFragment;
}

export const useAddGuestWorkspaceDetailsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseAddGuestWorkspaceDetailsFragmentOptions): UseAddGuestWorkspaceDetailsFragmentResult => {
  const result = Apollo.useFragment<AddGuestWorkspaceDetailsFragment>({
    ...options,
    fragment: AddGuestWorkspaceDetailsFragmentDoc,
    fragmentName: 'AddGuestWorkspaceDetails',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Organization', ...from },
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

  return { ...result, data: result.data as AddGuestWorkspaceDetailsFragment };
};
