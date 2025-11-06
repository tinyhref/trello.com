import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CrossFlowMemberFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'confirmed'>
);

export const CrossFlowMemberFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CrossFlowMember' },
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

interface UseCrossFlowMemberFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CrossFlowMemberFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCrossFlowMemberFragmentResult
  extends Omit<Apollo.UseFragmentResult<CrossFlowMemberFragment>, 'data'> {
  data?: CrossFlowMemberFragment;
}

export const useCrossFlowMemberFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCrossFlowMemberFragmentOptions): UseCrossFlowMemberFragmentResult => {
  const result = Apollo.useFragment<CrossFlowMemberFragment>({
    ...options,
    fragment: CrossFlowMemberFragmentDoc,
    fragmentName: 'CrossFlowMember',
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

  return { ...result, data: result.data as CrossFlowMemberFragment };
};
