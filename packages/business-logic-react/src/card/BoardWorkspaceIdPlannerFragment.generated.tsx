import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardWorkspaceIdPlannerFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'idOrganization'>
);

export const BoardWorkspaceIdPlannerFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardWorkspaceIdPlanner' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'idOrganization' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardWorkspaceIdPlannerFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardWorkspaceIdPlannerFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardWorkspaceIdPlannerFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<BoardWorkspaceIdPlannerFragment>,
    'data'
  > {
  data?: BoardWorkspaceIdPlannerFragment;
}

export const useBoardWorkspaceIdPlannerFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardWorkspaceIdPlannerFragmentOptions): UseBoardWorkspaceIdPlannerFragmentResult => {
  const result = Apollo.useFragment<BoardWorkspaceIdPlannerFragment>({
    ...options,
    fragment: BoardWorkspaceIdPlannerFragmentDoc,
    fragmentName: 'BoardWorkspaceIdPlanner',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Board', ...from },
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

  return { ...result, data: result.data as BoardWorkspaceIdPlannerFragment };
};
