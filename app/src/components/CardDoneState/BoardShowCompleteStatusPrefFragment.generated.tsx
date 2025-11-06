import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardShowCompleteStatusPrefFragment = (
  { __typename: 'Board' }
  & { prefs?: Types.Maybe<(
    { __typename: 'Board_Prefs' }
    & Pick<Types.Board_Prefs, 'showCompleteStatus'>
  )> }
);

export const BoardShowCompleteStatusPrefFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardShowCompleteStatusPref' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'showCompleteStatus' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardShowCompleteStatusPrefFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardShowCompleteStatusPrefFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardShowCompleteStatusPrefFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<BoardShowCompleteStatusPrefFragment>,
    'data'
  > {
  data?: BoardShowCompleteStatusPrefFragment;
}

export const useBoardShowCompleteStatusPrefFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardShowCompleteStatusPrefFragmentOptions): UseBoardShowCompleteStatusPrefFragmentResult => {
  const result = Apollo.useFragment<BoardShowCompleteStatusPrefFragment>({
    ...options,
    fragment: BoardShowCompleteStatusPrefFragmentDoc,
    fragmentName: 'BoardShowCompleteStatusPref',
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
    data: result.data as BoardShowCompleteStatusPrefFragment,
  };
};
