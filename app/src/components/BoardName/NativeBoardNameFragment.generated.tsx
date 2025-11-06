import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type NativeBoardNameFragment = (
  { __typename: 'TrelloBoard' }
  & Pick<Types.TrelloBoard, 'id' | 'name'>
);

export const NativeBoardNameFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'NativeBoardName' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloBoard' },
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

interface UseNativeBoardNameFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      NativeBoardNameFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseNativeBoardNameFragmentResult
  extends Omit<Apollo.UseFragmentResult<NativeBoardNameFragment>, 'data'> {
  data?: NativeBoardNameFragment;
}

export const useNativeBoardNameFragment = ({
  from,
  returnPartialData,
  ...options
}: UseNativeBoardNameFragmentOptions): UseNativeBoardNameFragmentResult => {
  const result = Apollo.useFragment<NativeBoardNameFragment>({
    ...options,
    fragment: NativeBoardNameFragmentDoc,
    fragmentName: 'NativeBoardName',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloBoard', ...from },
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

  return { ...result, data: result.data as NativeBoardNameFragment };
};
