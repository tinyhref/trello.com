import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MirrorCardUrlFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id' | 'shortLink'>
);

export const MirrorCardUrlFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MirrorCardUrl' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shortLink' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMirrorCardUrlFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<MirrorCardUrlFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMirrorCardUrlFragmentResult
  extends Omit<Apollo.UseFragmentResult<MirrorCardUrlFragment>, 'data'> {
  data?: MirrorCardUrlFragment;
}

export const useMirrorCardUrlFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMirrorCardUrlFragmentOptions): UseMirrorCardUrlFragmentResult => {
  const result = Apollo.useFragment<MirrorCardUrlFragment>({
    ...options,
    fragment: MirrorCardUrlFragmentDoc,
    fragmentName: 'MirrorCardUrl',
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

  return { ...result, data: result.data as MirrorCardUrlFragment };
};
