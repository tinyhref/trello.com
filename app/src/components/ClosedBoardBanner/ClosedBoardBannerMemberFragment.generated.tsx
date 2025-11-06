import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ClosedBoardBannerMemberFragment = (
  { __typename: 'Member' }
  & Pick<
    Types.Member,
    | 'id'
    | 'idEnterprisesAdmin'
    | 'idPremOrgsAdmin'
    | 'memberType'
  >
);

export const ClosedBoardBannerMemberFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ClosedBoardBannerMember' },
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
            name: { kind: 'Name', value: 'idEnterprisesAdmin' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idPremOrgsAdmin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberType' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseClosedBoardBannerMemberFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      ClosedBoardBannerMemberFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseClosedBoardBannerMemberFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<ClosedBoardBannerMemberFragment>,
    'data'
  > {
  data?: ClosedBoardBannerMemberFragment;
}

export const useClosedBoardBannerMemberFragment = ({
  from,
  returnPartialData,
  ...options
}: UseClosedBoardBannerMemberFragmentOptions): UseClosedBoardBannerMemberFragmentResult => {
  const result = Apollo.useFragment<ClosedBoardBannerMemberFragment>({
    ...options,
    fragment: ClosedBoardBannerMemberFragmentDoc,
    fragmentName: 'ClosedBoardBannerMember',
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

  return { ...result, data: result.data as ClosedBoardBannerMemberFragment };
};
