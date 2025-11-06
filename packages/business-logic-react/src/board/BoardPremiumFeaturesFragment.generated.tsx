import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardPremiumFeaturesFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'premiumFeatures'>
);

export const BoardPremiumFeaturesFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardPremiumFeatures' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'premiumFeatures' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardPremiumFeaturesFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardPremiumFeaturesFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardPremiumFeaturesFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardPremiumFeaturesFragment>, 'data'> {
  data?: BoardPremiumFeaturesFragment;
}

export const useBoardPremiumFeaturesFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardPremiumFeaturesFragmentOptions): UseBoardPremiumFeaturesFragmentResult => {
  const result = Apollo.useFragment<BoardPremiumFeaturesFragment>({
    ...options,
    fragment: BoardPremiumFeaturesFragmentDoc,
    fragmentName: 'BoardPremiumFeatures',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Board', ...from },
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

  return { ...result, data: result.data as BoardPremiumFeaturesFragment };
};
