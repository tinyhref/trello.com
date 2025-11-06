import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ViewFiltersContextFragment = (
  { __typename: 'OrganizationView' }
  & Pick<Types.OrganizationView, 'id' | 'idOrganization' | 'name'>
  & {
    prefs: (
      { __typename: 'OrganizationView_Prefs' }
      & Pick<Types.OrganizationView_Prefs, 'permissionLevel'>
    ),
    views: Array<(
      { __typename: 'OrganizationView_View' }
      & Pick<Types.OrganizationView_View, 'id' | 'defaultViewType'>
      & {
        cardFilter: (
          { __typename: 'OrganizationView_View_CardFilter' }
          & { criteria: Array<(
            { __typename: 'OrganizationView_View_CardFilter_Criteria' }
            & Pick<
              Types.OrganizationView_View_CardFilter_Criteria,
              | 'dueComplete'
              | 'idBoards'
              | 'idLists'
              | 'idMembers'
              | 'labels'
              | 'sort'
            >
            & {
              dateLastActivity?: Types.Maybe<(
                { __typename: 'CardFilter_Criteria_DateRange' }
                & {
                  end?: Types.Maybe<(
                    { __typename: 'CardFilter_AdvancedDate' }
                    & Pick<Types.CardFilter_AdvancedDate, 'dateType' | 'value'>
                  )>,
                  start?: Types.Maybe<(
                    { __typename: 'CardFilter_AdvancedDate' }
                    & Pick<Types.CardFilter_AdvancedDate, 'dateType' | 'value'>
                  )>,
                }
              )>,
              due?: Types.Maybe<(
                { __typename: 'CardFilter_Criteria_DateRange' }
                & Pick<Types.CardFilter_Criteria_DateRange, 'special'>
                & {
                  end?: Types.Maybe<(
                    { __typename: 'CardFilter_AdvancedDate' }
                    & Pick<Types.CardFilter_AdvancedDate, 'dateType' | 'value'>
                  )>,
                  start?: Types.Maybe<(
                    { __typename: 'CardFilter_AdvancedDate' }
                    & Pick<Types.CardFilter_AdvancedDate, 'dateType' | 'value'>
                  )>,
                }
              )>,
            }
          )> }
        ),
        viewOptions?: Types.Maybe<(
          { __typename: 'OrganizationView_View_ViewOptions' }
          & { Calendar?: Types.Maybe<(
            { __typename: 'OrganizationView_View_ViewOptions_Calendar' }
            & Pick<Types.OrganizationView_View_ViewOptions_Calendar, 'timeHorizon'>
          )> }
        )>,
      }
    )>,
  }
);

export const ViewFiltersContextFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ViewFiltersContext' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'OrganizationView' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idOrganization' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'permissionLevel' },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'views' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'cardFilter' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'criteria' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'dateLastActivity' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'end' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'dateType',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'value',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'start' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'dateType',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'value',
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
                              name: { kind: 'Name', value: 'due' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'end' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'dateType',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'value',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'special' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'start' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'dateType',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'value',
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
                              name: { kind: 'Name', value: 'dueComplete' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'idBoards' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'idLists' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'idMembers' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'labels' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'sort' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'defaultViewType' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'viewOptions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'Calendar' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'timeHorizon' },
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

interface UseViewFiltersContextFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      ViewFiltersContextFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseViewFiltersContextFragmentResult
  extends Omit<Apollo.UseFragmentResult<ViewFiltersContextFragment>, 'data'> {
  data?: ViewFiltersContextFragment;
}

export const useViewFiltersContextFragment = ({
  from,
  returnPartialData,
  ...options
}: UseViewFiltersContextFragmentOptions): UseViewFiltersContextFragmentResult => {
  const result = Apollo.useFragment<ViewFiltersContextFragment>({
    ...options,
    fragment: ViewFiltersContextFragmentDoc,
    fragmentName: 'ViewFiltersContext',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'OrganizationView', ...from },
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

  return { ...result, data: result.data as ViewFiltersContextFragment };
};
