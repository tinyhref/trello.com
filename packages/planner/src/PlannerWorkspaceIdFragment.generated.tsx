import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type PlannerWorkspaceIdFragment = (
  { __typename: 'TrelloMember' }
  & Pick<Types.TrelloMember, 'id'>
  & { planner?: Types.Maybe<(
    { __typename: 'TrelloPlanner' }
    & Pick<Types.TrelloPlanner, 'id'>
    & { workspace?: Types.Maybe<(
      { __typename: 'TrelloWorkspace' }
      & Pick<Types.TrelloWorkspace, 'id'>
    )> }
  )> }
);

export const PlannerWorkspaceIdFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PlannerWorkspaceId' },
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
                  name: { kind: 'Name', value: 'workspace' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
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

interface UsePlannerWorkspaceIdFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      PlannerWorkspaceIdFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UsePlannerWorkspaceIdFragmentResult
  extends Omit<Apollo.UseFragmentResult<PlannerWorkspaceIdFragment>, 'data'> {
  data?: PlannerWorkspaceIdFragment;
}

export const usePlannerWorkspaceIdFragment = ({
  from,
  returnPartialData,
  ...options
}: UsePlannerWorkspaceIdFragmentOptions): UsePlannerWorkspaceIdFragmentResult => {
  const result = Apollo.useFragment<PlannerWorkspaceIdFragment>({
    ...options,
    fragment: PlannerWorkspaceIdFragmentDoc,
    fragmentName: 'PlannerWorkspaceId',
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

  return { ...result, data: result.data as PlannerWorkspaceIdFragment };
};
