import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type UserCampaignsFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id' | 'idMemberReferrer'>
  & { campaigns: Array<(
    { __typename: 'Campaign' }
    & Pick<Types.Campaign, 'id' | 'dateDismissed' | 'name'>
  )> }
);

export const UserCampaignsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserCampaigns' },
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
            name: { kind: 'Name', value: 'campaigns' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'dateDismissed' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idMemberReferrer' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseUserCampaignsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<UserCampaignsFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseUserCampaignsFragmentResult
  extends Omit<Apollo.UseFragmentResult<UserCampaignsFragment>, 'data'> {
  data?: UserCampaignsFragment;
}

export const useUserCampaignsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseUserCampaignsFragmentOptions): UseUserCampaignsFragmentResult => {
  const result = Apollo.useFragment<UserCampaignsFragment>({
    ...options,
    fragment: UserCampaignsFragmentDoc,
    fragmentName: 'UserCampaigns',
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

  return { ...result, data: result.data as UserCampaignsFragment };
};
