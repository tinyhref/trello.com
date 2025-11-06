import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MandatoryTransferDateFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id'>
  & { enterpriseWithRequiredConversion?: Types.Maybe<(
    { __typename: 'Member_EnterpriseWithRequiredConversion' }
    & { prefs?: Types.Maybe<(
      { __typename: 'Member_EnterpriseWithRequiredConversionPrefs' }
      & Pick<Types.Member_EnterpriseWithRequiredConversionPrefs, 'mandatoryTransferDate'>
    )> }
  )> }
);

export const MandatoryTransferDateFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MandatoryTransferDate' },
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
            name: { kind: 'Name', value: 'enterpriseWithRequiredConversion' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'prefs' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'mandatoryTransferDate' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMandatoryTransferDateFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MandatoryTransferDateFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMandatoryTransferDateFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<MandatoryTransferDateFragment>,
    'data'
  > {
  data?: MandatoryTransferDateFragment;
}

export const useMandatoryTransferDateFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMandatoryTransferDateFragmentOptions): UseMandatoryTransferDateFragmentResult => {
  const result = Apollo.useFragment<MandatoryTransferDateFragment>({
    ...options,
    fragment: MandatoryTransferDateFragmentDoc,
    fragmentName: 'MandatoryTransferDate',
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

  return { ...result, data: result.data as MandatoryTransferDateFragment };
};
