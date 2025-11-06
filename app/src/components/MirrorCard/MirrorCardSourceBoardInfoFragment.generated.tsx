import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MirrorCardSourceBoardInfoFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'name'>
);

export const MirrorCardSourceBoardInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MirrorCardSourceBoardInfo' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMirrorCardSourceBoardInfoFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MirrorCardSourceBoardInfoFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMirrorCardSourceBoardInfoFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<MirrorCardSourceBoardInfoFragment>,
    'data'
  > {
  data?: MirrorCardSourceBoardInfoFragment;
}

export const useMirrorCardSourceBoardInfoFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMirrorCardSourceBoardInfoFragmentOptions): UseMirrorCardSourceBoardInfoFragmentResult => {
  const result = Apollo.useFragment<MirrorCardSourceBoardInfoFragment>({
    ...options,
    fragment: MirrorCardSourceBoardInfoFragmentDoc,
    fragmentName: 'MirrorCardSourceBoardInfo',
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

  return { ...result, data: result.data as MirrorCardSourceBoardInfoFragment };
};
