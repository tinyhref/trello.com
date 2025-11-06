import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MonetizationWorkspaceOfferingFragment = (
  { __typename: 'Organization' }
  & Pick<Types.Organization, 'id' | 'offering'>
  & { paidAccount?: Types.Maybe<(
    { __typename: 'PaidAccount' }
    & Pick<Types.PaidAccount, 'trialExpiration' | 'trialType'>
  )> }
);

export const MonetizationWorkspaceOfferingFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MonetizationWorkspaceOffering' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Organization' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'offering' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'paidAccount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'trialExpiration' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'trialType' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMonetizationWorkspaceOfferingFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MonetizationWorkspaceOfferingFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMonetizationWorkspaceOfferingFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<MonetizationWorkspaceOfferingFragment>,
    'data'
  > {
  data?: MonetizationWorkspaceOfferingFragment;
}

export const useMonetizationWorkspaceOfferingFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMonetizationWorkspaceOfferingFragmentOptions): UseMonetizationWorkspaceOfferingFragmentResult => {
  const result = Apollo.useFragment<MonetizationWorkspaceOfferingFragment>({
    ...options,
    fragment: MonetizationWorkspaceOfferingFragmentDoc,
    fragmentName: 'MonetizationWorkspaceOffering',
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

  return {
    ...result,
    data: result.data as MonetizationWorkspaceOfferingFragment,
  };
};
