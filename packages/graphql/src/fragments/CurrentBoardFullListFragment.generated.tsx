import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CurrentBoardFullListFragment = (
  { __typename: 'List' }
  & Pick<
    Types.List,
    | 'id'
    | 'closed'
    | 'color'
    | 'creationMethod'
    | 'idBoard'
    | 'name'
    | 'pos'
    | 'softLimit'
    | 'subscribed'
    | 'type'
  >
  & {
    datasource?: Types.Maybe<(
      { __typename: 'List_DataSource' }
      & Pick<Types.List_DataSource, 'filter' | 'handler' | 'link'>
    )>,
    limits: (
      { __typename: 'List_Limits' }
      & { cards: (
        { __typename: 'List_Limits_Cards' }
        & {
          openPerList: (
            { __typename: 'Limit' }
            & Pick<
              Types.Limit,
              | 'count'
              | 'disableAt'
              | 'status'
              | 'warnAt'
            >
          ),
          totalPerList: (
            { __typename: 'Limit' }
            & Pick<
              Types.Limit,
              | 'count'
              | 'disableAt'
              | 'status'
              | 'warnAt'
            >
          ),
        }
      ) }
    ),
  }
);

export const CurrentBoardFullListFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CurrentBoardFullList' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'creationMethod' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'datasource' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'filter' } },
                { kind: 'Field', name: { kind: 'Name', value: 'handler' } },
                { kind: 'Field', name: { kind: 'Name', value: 'link' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idBoard' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'limits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'cards' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'openPerList' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'count' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'disableAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'warnAt' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalPerList' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'count' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'disableAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'warnAt' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pos' } },
          { kind: 'Field', name: { kind: 'Name', value: 'softLimit' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subscribed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCurrentBoardFullListFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CurrentBoardFullListFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCurrentBoardFullListFragmentResult
  extends Omit<Apollo.UseFragmentResult<CurrentBoardFullListFragment>, 'data'> {
  data?: CurrentBoardFullListFragment;
}

export const useCurrentBoardFullListFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCurrentBoardFullListFragmentOptions): UseCurrentBoardFullListFragmentResult => {
  const result = Apollo.useFragment<CurrentBoardFullListFragment>({
    ...options,
    fragment: CurrentBoardFullListFragmentDoc,
    fragmentName: 'CurrentBoardFullList',
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

  return { ...result, data: result.data as CurrentBoardFullListFragment };
};
