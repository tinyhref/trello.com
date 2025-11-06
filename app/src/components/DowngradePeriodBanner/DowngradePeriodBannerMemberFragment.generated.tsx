import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type DowngradePeriodBannerMemberFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id' | 'confirmed'>
  & { organizations: Array<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'name'>
  )> }
);

export const DowngradePeriodBannerMemberFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DowngradePeriodBannerMember' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'organizations' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseDowngradePeriodBannerMemberFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      DowngradePeriodBannerMemberFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseDowngradePeriodBannerMemberFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<DowngradePeriodBannerMemberFragment>,
    'data'
  > {
  data?: DowngradePeriodBannerMemberFragment;
}

export const useDowngradePeriodBannerMemberFragment = ({
  from,
  returnPartialData,
  ...options
}: UseDowngradePeriodBannerMemberFragmentOptions): UseDowngradePeriodBannerMemberFragmentResult => {
  const result = Apollo.useFragment<DowngradePeriodBannerMemberFragment>({
    ...options,
    fragment: DowngradePeriodBannerMemberFragmentDoc,
    fragmentName: 'DowngradePeriodBannerMember',
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
    data: result.data as DowngradePeriodBannerMemberFragment,
  };
};
