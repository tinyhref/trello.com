import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardPreferencesContextFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id'>
  & { prefs?: Types.Maybe<(
    { __typename: 'Board_Prefs' }
    & Pick<Types.Board_Prefs, 'cardCovers'>
  )> }
);

export const BoardPreferencesContextFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardPreferencesContext' },
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
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'cardCovers' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardPreferencesContextFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardPreferencesContextFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardPreferencesContextFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<BoardPreferencesContextFragment>,
    'data'
  > {
  data?: BoardPreferencesContextFragment;
}

export const useBoardPreferencesContextFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardPreferencesContextFragmentOptions): UseBoardPreferencesContextFragmentResult => {
  const result = Apollo.useFragment<BoardPreferencesContextFragment>({
    ...options,
    fragment: BoardPreferencesContextFragmentDoc,
    fragmentName: 'BoardPreferencesContext',
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

  return { ...result, data: result.data as BoardPreferencesContextFragment };
};
