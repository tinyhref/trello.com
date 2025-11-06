import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloCardUpdatedSubscriptionCardFragment = (
  { __typename: 'TrelloCardUpdated' }
  & Pick<Types.TrelloCardUpdated, 'id'>
  & { labels?: Types.Maybe<(
    { __typename: 'TrelloLabelUpdatedConnection' }
    & { edges?: Types.Maybe<Array<(
      { __typename: 'TrelloCardLabelEdgeUpdated' }
      & { node: (
        { __typename: 'TrelloLabelId' }
        & Pick<Types.TrelloLabelId, 'id'>
      ) }
    )>> }
  )> }
);

export const TrelloCardUpdatedSubscriptionCardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloCardUpdatedSubscriptionCard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCardUpdated' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'labels' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
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
      },
    },
  ],
} as unknown as DocumentNode;

interface UseTrelloCardUpdatedSubscriptionCardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloCardUpdatedSubscriptionCardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloCardUpdatedSubscriptionCardFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloCardUpdatedSubscriptionCardFragment>,
    'data'
  > {
  data?: TrelloCardUpdatedSubscriptionCardFragment;
}

export const useTrelloCardUpdatedSubscriptionCardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloCardUpdatedSubscriptionCardFragmentOptions): UseTrelloCardUpdatedSubscriptionCardFragmentResult => {
  const result = Apollo.useFragment<TrelloCardUpdatedSubscriptionCardFragment>({
    ...options,
    fragment: TrelloCardUpdatedSubscriptionCardFragmentDoc,
    fragmentName: 'TrelloCardUpdatedSubscriptionCard',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloCardUpdated', ...from },
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
    data: result.data as TrelloCardUpdatedSubscriptionCardFragment,
  };
};
