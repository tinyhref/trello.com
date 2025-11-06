import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type AutoOpenCrossFlowMemberFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'confirmed'>
);

export const AutoOpenCrossFlowMemberFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AutoOpenCrossFlowMember' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseAutoOpenCrossFlowMemberFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      AutoOpenCrossFlowMemberFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseAutoOpenCrossFlowMemberFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<AutoOpenCrossFlowMemberFragment>,
    'data'
  > {
  data?: AutoOpenCrossFlowMemberFragment;
}

export const useAutoOpenCrossFlowMemberFragment = ({
  from,
  returnPartialData,
  ...options
}: UseAutoOpenCrossFlowMemberFragmentOptions): UseAutoOpenCrossFlowMemberFragmentResult => {
  const result = Apollo.useFragment<AutoOpenCrossFlowMemberFragment>({
    ...options,
    fragment: AutoOpenCrossFlowMemberFragmentDoc,
    fragmentName: 'AutoOpenCrossFlowMember',
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

  return { ...result, data: result.data as AutoOpenCrossFlowMemberFragment };
};
