import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MirrorCardBoardInfoFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id'>
  & { myPrefs: (
    { __typename: 'MyPrefs' }
    & Pick<Types.MyPrefs, 'showCompactMirrorCards'>
  ) }
);

export const MirrorCardBoardInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MirrorCardBoardInfo' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'myPrefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'showCompactMirrorCards' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMirrorCardBoardInfoFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MirrorCardBoardInfoFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMirrorCardBoardInfoFragmentResult
  extends Omit<Apollo.UseFragmentResult<MirrorCardBoardInfoFragment>, 'data'> {
  data?: MirrorCardBoardInfoFragment;
}

export const useMirrorCardBoardInfoFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMirrorCardBoardInfoFragmentOptions): UseMirrorCardBoardInfoFragmentResult => {
  const result = Apollo.useFragment<MirrorCardBoardInfoFragment>({
    ...options,
    fragment: MirrorCardBoardInfoFragmentDoc,
    fragmentName: 'MirrorCardBoardInfo',
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

  return { ...result, data: result.data as MirrorCardBoardInfoFragment };
};
