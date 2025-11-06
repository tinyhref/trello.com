import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ProviderCalendarFieldsFragment = (
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
);

export const ProviderCalendarFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProviderCalendarFields' },
      typeCondition: {
        kind: 'NamedType',
        name: {
          kind: 'Name',
          value: 'TrelloPlannerProviderCalendarConnection',
        },
      },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'isPrimary' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'providerAccountId' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pageInfo' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'endCursor' } },
                { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseProviderCalendarFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      ProviderCalendarFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseProviderCalendarFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<ProviderCalendarFieldsFragment>,
    'data'
  > {
  data?: ProviderCalendarFieldsFragment;
}

export const useProviderCalendarFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseProviderCalendarFieldsFragmentOptions): UseProviderCalendarFieldsFragmentResult => {
  const result = Apollo.useFragment<ProviderCalendarFieldsFragment>({
    ...options,
    fragment: ProviderCalendarFieldsFragmentDoc,
    fragmentName: 'ProviderCalendarFields',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloPlannerProviderCalendarConnection', ...from },
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

  return { ...result, data: result.data as ProviderCalendarFieldsFragment };
};
