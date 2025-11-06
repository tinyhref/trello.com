import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MemberCohortsFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id'>
  & { cohorts?: Types.Maybe<(
    { __typename: 'Cohorts' }
    & Pick<Types.Cohorts, 'userCohortPersonalProductivity'>
  )> }
);

export const MemberCohortsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MemberCohorts' },
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
                    value: 'userCohortPersonalProductivity',
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

interface UseMemberCohortsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<MemberCohortsFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMemberCohortsFragmentResult
  extends Omit<Apollo.UseFragmentResult<MemberCohortsFragment>, 'data'> {
  data?: MemberCohortsFragment;
}

export const useMemberCohortsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMemberCohortsFragmentOptions): UseMemberCohortsFragmentResult => {
  const result = Apollo.useFragment<MemberCohortsFragment>({
    ...options,
    fragment: MemberCohortsFragmentDoc,
    fragmentName: 'MemberCohorts',
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

  return { ...result, data: result.data as MemberCohortsFragment };
};
