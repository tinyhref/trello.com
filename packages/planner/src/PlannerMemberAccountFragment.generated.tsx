import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type PlannerMemberAccountFragment = (
  { __typename: 'TrelloMember' }
  & Pick<Types.TrelloMember, 'id'>
  & { planner?: Types.Maybe<(
    { __typename: 'TrelloPlanner' }
    & Pick<Types.TrelloPlanner, 'id' | 'primaryAccountId'>
    & { accounts?: Types.Maybe<(
      { __typename: 'TrelloPlannerCalendarAccountConnection' }
      & { edges?: Types.Maybe<Array<(
        { __typename: 'TrelloPlannerCalendarAccountEdge' }
        & { node?: Types.Maybe<(
          { __typename: 'TrelloPlannerCalendarAccount' }
          & Pick<
            Types.TrelloPlannerCalendarAccount,
            | 'id'
            | 'accountType'
            | 'displayName'
            | 'hasRequiredScopes'
            | 'isExpired'
            | 'outboundAuthId'
          >
          & {
            enabledCalendars?: Types.Maybe<(
              { __typename: 'TrelloPlannerCalendarConnection' }
              & {
                edges?: Types.Maybe<Array<(
                  { __typename: 'TrelloPlannerCalendarEdge' }
                  & { node?: Types.Maybe<(
                    { __typename: 'TrelloPlannerCalendar' }
                    & Pick<
                      Types.TrelloPlannerCalendar,
                      | 'id'
                      | 'color'
                      | 'enabled'
                      | 'isPrimary'
                      | 'providerCalendarId'
                      | 'title'
                    >
                  )> }
                )>>,
                pageInfo: (
                  { __typename: 'PageInfo' }
                  & Pick<Types.PageInfo, 'endCursor' | 'hasNextPage'>
                ),
              }
            )>,
            providerCalendars?: Types.Maybe<(
              { __typename: 'TrelloPlannerProviderCalendarConnection' }
              & {
                edges?: Types.Maybe<Array<(
                  { __typename: 'TrelloPlannerProviderCalendarEdge' }
                  & { node?: Types.Maybe<(
                    { __typename: 'TrelloPlannerProviderCalendar' }
                    & Pick<
                      Types.TrelloPlannerProviderCalendar,
                      | 'id'
                      | 'color'
                      | 'isPrimary'
                      | 'providerAccountId'
                      | 'title'
                    >
                  )> }
                )>>,
                pageInfo: (
                  { __typename: 'PageInfo' }
                  & Pick<Types.PageInfo, 'endCursor' | 'hasNextPage'>
                ),
              }
            )>,
          }
        )> }
      )>> }
    )> }
  )> }
);

export const PlannerMemberAccountFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PlannerMemberAccount' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloMember' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'planner' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'accounts' },
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
                                    name: {
                                      kind: 'Name',
                                      value: 'accountType',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'displayName',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'enabledCalendars',
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'edges',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'node',
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'id',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'color',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'enabled',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'isPrimary',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value:
                                                          'providerCalendarId',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'title',
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'pageInfo',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'endCursor',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'hasNextPage',
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'hasRequiredScopes',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'isExpired' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'outboundAuthId',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'providerCalendars',
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'edges',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'node',
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'id',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'color',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'isPrimary',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value:
                                                          'providerAccountId',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'title',
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'pageInfo',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'endCursor',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'hasNextPage',
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
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'primaryAccountId' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UsePlannerMemberAccountFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      PlannerMemberAccountFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UsePlannerMemberAccountFragmentResult
  extends Omit<Apollo.UseFragmentResult<PlannerMemberAccountFragment>, 'data'> {
  data?: PlannerMemberAccountFragment;
}

export const usePlannerMemberAccountFragment = ({
  from,
  returnPartialData,
  ...options
}: UsePlannerMemberAccountFragmentOptions): UsePlannerMemberAccountFragmentResult => {
  const result = Apollo.useFragment<PlannerMemberAccountFragment>({
    ...options,
    fragment: PlannerMemberAccountFragmentDoc,
    fragmentName: 'PlannerMemberAccount',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloMember', ...from },
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

  return { ...result, data: result.data as PlannerMemberAccountFragment };
};
