import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type PremiumFeaturesWorkspaceFragment = (
  { __typename: 'Organization' }
  & Pick<Types.Organization, 'id' | 'premiumFeatures'>
);

export const PremiumFeaturesWorkspaceFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PremiumFeaturesWorkspace' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Organization' },
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

interface UsePremiumFeaturesWorkspaceFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      PremiumFeaturesWorkspaceFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UsePremiumFeaturesWorkspaceFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<PremiumFeaturesWorkspaceFragment>,
    'data'
  > {
  data?: PremiumFeaturesWorkspaceFragment;
}

export const usePremiumFeaturesWorkspaceFragment = ({
  from,
  returnPartialData,
  ...options
}: UsePremiumFeaturesWorkspaceFragmentOptions): UsePremiumFeaturesWorkspaceFragmentResult => {
  const result = Apollo.useFragment<PremiumFeaturesWorkspaceFragment>({
    ...options,
    fragment: PremiumFeaturesWorkspaceFragmentDoc,
    fragmentName: 'PremiumFeaturesWorkspace',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Organization', ...from },
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

  return { ...result, data: result.data as PremiumFeaturesWorkspaceFragment };
};
