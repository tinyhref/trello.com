import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type FilterableCardFragment = (
  { __typename: 'Card' }
  & Pick<
    Types.Card,
    | 'dateLastActivity'
    | 'due'
    | 'dueComplete'
    | 'idMembers'
    | 'idShort'
    | 'name'
  >
  & {
    customFieldItems: Array<(
      { __typename: 'CustomFieldItem' }
      & Pick<Types.CustomFieldItem, 'idValue'>
      & { value?: Types.Maybe<(
        { __typename: 'CustomFieldItem_Value' }
        & Pick<Types.CustomFieldItem_Value, 'text'>
      )> }
    )>,
    labels: Array<(
      { __typename: 'Label' }
      & Pick<Types.Label, 'color' | 'name'>
    )>,
  }
);

export const FilterableCardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FilterableCard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFieldItems' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'idValue' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'value' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'text' } },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'dateLastActivity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'due' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dueComplete' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idMembers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idShort' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'labels' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseFilterableCardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      FilterableCardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseFilterableCardFragmentResult
  extends Omit<Apollo.UseFragmentResult<FilterableCardFragment>, 'data'> {
  data?: FilterableCardFragment;
}

export const useFilterableCardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseFilterableCardFragmentOptions): UseFilterableCardFragmentResult => {
  const result = Apollo.useFragment<FilterableCardFragment>({
    ...options,
    fragment: FilterableCardFragmentDoc,
    fragmentName: 'FilterableCard',
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

  return { ...result, data: result.data as FilterableCardFragment };
};
