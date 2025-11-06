import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MirrorCardDataPlannerFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'idBoard' | 'name'>
);

export const MirrorCardDataPlannerFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MirrorCardDataPlanner' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'idBoard' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMirrorCardDataPlannerFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MirrorCardDataPlannerFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMirrorCardDataPlannerFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<MirrorCardDataPlannerFragment>,
    'data'
  > {
  data?: MirrorCardDataPlannerFragment;
}

export const useMirrorCardDataPlannerFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMirrorCardDataPlannerFragmentOptions): UseMirrorCardDataPlannerFragmentResult => {
  const result = Apollo.useFragment<MirrorCardDataPlannerFragment>({
    ...options,
    fragment: MirrorCardDataPlannerFragmentDoc,
    fragmentName: 'MirrorCardDataPlanner',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Card', ...from },
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

  return { ...result, data: result.data as MirrorCardDataPlannerFragment };
};
