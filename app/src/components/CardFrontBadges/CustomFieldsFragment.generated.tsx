import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CustomFieldsFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id'>
  & { customFields: Array<(
    { __typename: 'CustomField' }
    & Pick<Types.CustomField, 'id' | 'name' | 'pos'>
    & { display: (
      { __typename: 'CustomField_Display' }
      & Pick<Types.CustomField_Display, 'cardFront'>
    ) }
  )> }
);

export const CustomFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CustomFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFields' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'display' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cardFront' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'pos' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCustomFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<CustomFieldsFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCustomFieldsFragmentResult
  extends Omit<Apollo.UseFragmentResult<CustomFieldsFragment>, 'data'> {
  data?: CustomFieldsFragment;
}

export const useCustomFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCustomFieldsFragmentOptions): UseCustomFieldsFragmentResult => {
  const result = Apollo.useFragment<CustomFieldsFragment>({
    ...options,
    fragment: CustomFieldsFragmentDoc,
    fragmentName: 'CustomFields',
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

  return { ...result, data: result.data as CustomFieldsFragment };
};
