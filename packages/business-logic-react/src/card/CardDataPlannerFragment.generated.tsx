import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardDataPlannerFragment = (
  { __typename: 'Card' }
  & Pick<
    Types.Card,
    | 'id'
    | 'cardRole'
    | 'idBoard'
    | 'mirrorSourceId'
    | 'name'
  >
);

export const CardDataPlannerFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardDataPlanner' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'cardRole' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idBoard' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mirrorSourceId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardDataPlannerFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardDataPlannerFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardDataPlannerFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardDataPlannerFragment>, 'data'> {
  data?: CardDataPlannerFragment;
}

export const useCardDataPlannerFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardDataPlannerFragmentOptions): UseCardDataPlannerFragmentResult => {
  const result = Apollo.useFragment<CardDataPlannerFragment>({
    ...options,
    fragment: CardDataPlannerFragmentDoc,
    fragmentName: 'CardDataPlanner',
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

  return { ...result, data: result.data as CardDataPlannerFragment };
};
