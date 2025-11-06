import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type PlannerEventCardsFragment = (
  { __typename: 'TrelloPlannerCalendarEvent' }
  & Pick<Types.TrelloPlannerCalendarEvent, 'id' | 'plannerCalendarId'>
  & { cards?: Types.Maybe<(
    { __typename: 'TrelloPlannerCalendarEventCardConnection' }
    & { edges?: Types.Maybe<Array<(
      { __typename: 'TrelloPlannerCalendarEventCardEdge' }
      & { node?: Types.Maybe<(
        { __typename: 'TrelloPlannerCalendarEventCard' }
        & Pick<Types.TrelloPlannerCalendarEventCard, 'id' | 'position'>
        & { card?: Types.Maybe<(
          { __typename: 'TrelloCard' }
          & Pick<Types.TrelloCard, 'id' | 'name' | 'objectId'>
        )> }
      )> }
    )>> }
  )> }
);

export const PlannerEventCardsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PlannerEventCards' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloPlannerCalendarEvent' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cards' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'IntValue', value: '10' },
              },
            ],
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'card' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'name' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'objectId' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'position' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'plannerCalendarId' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UsePlannerEventCardsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      PlannerEventCardsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UsePlannerEventCardsFragmentResult
  extends Omit<Apollo.UseFragmentResult<PlannerEventCardsFragment>, 'data'> {
  data?: PlannerEventCardsFragment;
}

export const usePlannerEventCardsFragment = ({
  from,
  returnPartialData,
  ...options
}: UsePlannerEventCardsFragmentOptions): UsePlannerEventCardsFragmentResult => {
  const result = Apollo.useFragment<PlannerEventCardsFragment>({
    ...options,
    fragment: PlannerEventCardsFragmentDoc,
    fragmentName: 'PlannerEventCards',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloPlannerCalendarEvent', ...from },
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

  return { ...result, data: result.data as PlannerEventCardsFragment };
};
