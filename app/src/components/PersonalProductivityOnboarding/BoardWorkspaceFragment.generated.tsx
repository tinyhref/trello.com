import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardWorkspaceFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'idOrganization'>
);

export const BoardWorkspaceFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardWorkspace' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idOrganization' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardWorkspaceFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardWorkspaceFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardWorkspaceFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardWorkspaceFragment>, 'data'> {
  data?: BoardWorkspaceFragment;
}

export const useBoardWorkspaceFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardWorkspaceFragmentOptions): UseBoardWorkspaceFragmentResult => {
  const result = Apollo.useFragment<BoardWorkspaceFragment>({
    ...options,
    fragment: BoardWorkspaceFragmentDoc,
    fragmentName: 'BoardWorkspace',
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

  return { ...result, data: result.data as BoardWorkspaceFragment };
};
