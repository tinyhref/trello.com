import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MirrorCardSourceIdFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id' | 'mirrorSourceId' | 'nodeId'>
);

export const MirrorCardSourceIdFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MirrorCardSourceId' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mirrorSourceId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMirrorCardSourceIdFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MirrorCardSourceIdFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMirrorCardSourceIdFragmentResult
  extends Omit<Apollo.UseFragmentResult<MirrorCardSourceIdFragment>, 'data'> {
  data?: MirrorCardSourceIdFragment;
}

export const useMirrorCardSourceIdFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMirrorCardSourceIdFragmentOptions): UseMirrorCardSourceIdFragmentResult => {
  const result = Apollo.useFragment<MirrorCardSourceIdFragment>({
    ...options,
    fragment: MirrorCardSourceIdFragmentDoc,
    fragmentName: 'MirrorCardSourceId',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Card', ...from },
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

  return { ...result, data: result.data as MirrorCardSourceIdFragment };
};
