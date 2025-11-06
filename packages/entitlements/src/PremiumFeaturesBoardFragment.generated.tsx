import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type PremiumFeaturesBoardFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'premiumFeatures'>
);

export const PremiumFeaturesBoardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PremiumFeaturesBoard' },
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

interface UsePremiumFeaturesBoardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      PremiumFeaturesBoardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UsePremiumFeaturesBoardFragmentResult
  extends Omit<Apollo.UseFragmentResult<PremiumFeaturesBoardFragment>, 'data'> {
  data?: PremiumFeaturesBoardFragment;
}

export const usePremiumFeaturesBoardFragment = ({
  from,
  returnPartialData,
  ...options
}: UsePremiumFeaturesBoardFragmentOptions): UsePremiumFeaturesBoardFragmentResult => {
  const result = Apollo.useFragment<PremiumFeaturesBoardFragment>({
    ...options,
    fragment: PremiumFeaturesBoardFragmentDoc,
    fragmentName: 'PremiumFeaturesBoard',
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

  return { ...result, data: result.data as PremiumFeaturesBoardFragment };
};
