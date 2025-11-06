import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardRecurrenceFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id'>
  & { recurrenceRule?: Types.Maybe<(
    { __typename: 'Card_RecurrenceRule' }
    & Pick<Types.Card_RecurrenceRule, 'rule'>
  )> }
);

export const CardRecurrenceFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardRecurrence' },
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

interface UseCardRecurrenceFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardRecurrenceFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardRecurrenceFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardRecurrenceFragment>, 'data'> {
  data?: CardRecurrenceFragment;
}

export const useCardRecurrenceFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardRecurrenceFragmentOptions): UseCardRecurrenceFragmentResult => {
  const result = Apollo.useFragment<CardRecurrenceFragment>({
    ...options,
    fragment: CardRecurrenceFragmentDoc,
    fragmentName: 'CardRecurrence',
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

  return { ...result, data: result.data as CardRecurrenceFragment };
};
