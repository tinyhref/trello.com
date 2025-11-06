import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MemberPersonalProductivityBannerCohortFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id'>
  & { cohorts?: Types.Maybe<(
    { __typename: 'Cohorts' }
    & Pick<Types.Cohorts, 'userCohortGoldenPersonalProductivityEngagement'>
  )> }
);

export const MemberPersonalProductivityBannerCohortFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MemberPersonalProductivityBannerCohort' },
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
            name: { kind: 'Name', value: 'cohorts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: {
                    kind: 'Name',
                    value: 'userCohortGoldenPersonalProductivityEngagement',
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

interface UseMemberPersonalProductivityBannerCohortFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MemberPersonalProductivityBannerCohortFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMemberPersonalProductivityBannerCohortFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<MemberPersonalProductivityBannerCohortFragment>,
    'data'
  > {
  data?: MemberPersonalProductivityBannerCohortFragment;
}

export const useMemberPersonalProductivityBannerCohortFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMemberPersonalProductivityBannerCohortFragmentOptions): UseMemberPersonalProductivityBannerCohortFragmentResult => {
  const result =
    Apollo.useFragment<MemberPersonalProductivityBannerCohortFragment>({
      ...options,
      fragment: MemberPersonalProductivityBannerCohortFragmentDoc,
      fragmentName: 'MemberPersonalProductivityBannerCohort',
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

  return {
    ...result,
    data: result.data as MemberPersonalProductivityBannerCohortFragment,
  };
};
