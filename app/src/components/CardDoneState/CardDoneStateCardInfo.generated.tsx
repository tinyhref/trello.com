import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardDoneStateCardInfoFragment = (
  { __typename: 'Card' }
  & Pick<
    Types.Card,
    | 'id'
    | 'due'
    | 'idList'
    | 'idMembers'
    | 'name'
  >
  & {
    customFieldItems: Array<(
      { __typename: 'CustomFieldItem' }
      & Pick<Types.CustomFieldItem, 'id'>
    )>,
    labels: Array<(
      { __typename: 'Label' }
      & Pick<Types.Label, 'id'>
    )>,
    recurrenceRule?: Types.Maybe<(
      { __typename: 'Card_RecurrenceRule' }
      & Pick<Types.Card_RecurrenceRule, 'rule'>
    )>,
  }
);

export const CardDoneStateCardInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardDoneStateCardInfo' },
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
            name: { kind: 'Name', value: 'customFieldItems' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'due' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idList' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idMembers' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'labels' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'recurrenceRule' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'rule' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardDoneStateCardInfoFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardDoneStateCardInfoFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardDoneStateCardInfoFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<CardDoneStateCardInfoFragment>,
    'data'
  > {
  data?: CardDoneStateCardInfoFragment;
}

export const useCardDoneStateCardInfoFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardDoneStateCardInfoFragmentOptions): UseCardDoneStateCardInfoFragmentResult => {
  const result = Apollo.useFragment<CardDoneStateCardInfoFragment>({
    ...options,
    fragment: CardDoneStateCardInfoFragmentDoc,
    fragmentName: 'CardDoneStateCardInfo',
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

  return { ...result, data: result.data as CardDoneStateCardInfoFragment };
};
