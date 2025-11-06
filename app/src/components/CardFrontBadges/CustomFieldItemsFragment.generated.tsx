import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CustomFieldItemsFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id'>
  & {
    board: (
      { __typename: 'Board' }
      & Pick<Types.Board, 'id'>
    ),
    customFieldItems: Array<(
      { __typename: 'CustomFieldItem' }
      & Pick<Types.CustomFieldItem, 'id' | 'idCustomField' | 'idValue'>
      & { value?: Types.Maybe<(
        { __typename: 'CustomFieldItem_Value' }
        & Pick<
          Types.CustomFieldItem_Value,
          | 'checked'
          | 'date'
          | 'number'
          | 'text'
        >
      )> }
    )>,
  }
);

export const CustomFieldItemsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CustomFieldItems' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'board' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFieldItems' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idCustomField' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'idValue' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'value' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'checked' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'number' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'text' } },
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

interface UseCustomFieldItemsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CustomFieldItemsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCustomFieldItemsFragmentResult
  extends Omit<Apollo.UseFragmentResult<CustomFieldItemsFragment>, 'data'> {
  data?: CustomFieldItemsFragment;
}

export const useCustomFieldItemsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCustomFieldItemsFragmentOptions): UseCustomFieldItemsFragmentResult => {
  const result = Apollo.useFragment<CustomFieldItemsFragment>({
    ...options,
    fragment: CustomFieldItemsFragmentDoc,
    fragmentName: 'CustomFieldItems',
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

  return { ...result, data: result.data as CustomFieldItemsFragment };
};
