import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardActionFragment = (
  { __typename: 'Card' }
  & Pick<
    Types.Card,
    | 'id'
    | 'closed'
    | 'desc'
    | 'due'
    | 'dueReminder'
    | 'idBoard'
    | 'idLabels'
    | 'idList'
    | 'idMembers'
    | 'name'
    | 'pos'
    | 'start'
    | 'subscribed'
  >
);

export const CardActionFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardAction' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'desc' } },
          { kind: 'Field', name: { kind: 'Name', value: 'due' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dueReminder' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idBoard' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idLabels' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idList' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idMembers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pos' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subscribed' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardActionFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<CardActionFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardActionFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardActionFragment>, 'data'> {
  data?: CardActionFragment;
}

export const useCardActionFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardActionFragmentOptions): UseCardActionFragmentResult => {
  const result = Apollo.useFragment<CardActionFragment>({
    ...options,
    fragment: CardActionFragmentDoc,
    fragmentName: 'CardAction',
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

  return { ...result, data: result.data as CardActionFragment };
};
