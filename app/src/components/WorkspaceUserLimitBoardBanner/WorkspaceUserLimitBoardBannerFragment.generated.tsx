import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type WorkspaceUserLimitBoardBannerFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'closed'>
  & { members: Array<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
  )> }
);

export const WorkspaceUserLimitBoardBannerFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WorkspaceUserLimitBoardBanner' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'members' },
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
} as unknown as DocumentNode;

interface UseWorkspaceUserLimitBoardBannerFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      WorkspaceUserLimitBoardBannerFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseWorkspaceUserLimitBoardBannerFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<WorkspaceUserLimitBoardBannerFragment>,
    'data'
  > {
  data?: WorkspaceUserLimitBoardBannerFragment;
}

export const useWorkspaceUserLimitBoardBannerFragment = ({
  from,
  returnPartialData,
  ...options
}: UseWorkspaceUserLimitBoardBannerFragmentOptions): UseWorkspaceUserLimitBoardBannerFragmentResult => {
  const result = Apollo.useFragment<WorkspaceUserLimitBoardBannerFragment>({
    ...options,
    fragment: WorkspaceUserLimitBoardBannerFragmentDoc,
    fragmentName: 'WorkspaceUserLimitBoardBanner',
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

  return {
    ...result,
    data: result.data as WorkspaceUserLimitBoardBannerFragment,
  };
};
