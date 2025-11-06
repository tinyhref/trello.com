import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardsOnListFragment = (
  { __typename: 'List' }
  & { cards: Array<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'idMembers'>
  )> }
);

export type CheckItemsAssignedCardsOnListFragment = (
  { __typename: 'List' }
  & { cards: Array<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'idMembers'>
  )> }
);

export type ClosedCardsOnListFragment = (
  { __typename: 'List' }
  & { cards: Array<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'idMembers'>
  )> }
);

export type OpenCardsOnListFragment = (
  { __typename: 'List' }
  & { cards: Array<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'idMembers'>
  )> }
);

export type TemplateCardsOnListFragment = (
  { __typename: 'List' }
  & { cards: Array<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'idMembers'>
  )> }
);

export type VisibleCardsOnListFragment = (
  { __typename: 'List' }
  & { cards: Array<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'idMembers'>
  )> }
);

export const CardsOnListFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardsOnList' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cards' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idMembers' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export const CheckItemsAssignedCardsOnListFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'checkItemsAssignedCardsOnList' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cards' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'EnumValue', value: 'checkItemsAssigned' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idMembers' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export const ClosedCardsOnListFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'closedCardsOnList' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cards' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'EnumValue', value: 'closed' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idMembers' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export const OpenCardsOnListFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OpenCardsOnList' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cards' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'EnumValue', value: 'open' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idMembers' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export const TemplateCardsOnListFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'templateCardsOnList' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cards' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'EnumValue', value: 'template' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idMembers' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export const VisibleCardsOnListFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'visibleCardsOnList' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cards' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'EnumValue', value: 'visible' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idMembers' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardsOnListFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<CardsOnListFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardsOnListFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardsOnListFragment>, 'data'> {
  data?: CardsOnListFragment;
}

export const useCardsOnListFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardsOnListFragmentOptions): UseCardsOnListFragmentResult => {
  const result = Apollo.useFragment<CardsOnListFragment>({
    ...options,
    fragment: CardsOnListFragmentDoc,
    fragmentName: 'CardsOnList',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'List', ...from },
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

  return { ...result, data: result.data as CardsOnListFragment };
};
