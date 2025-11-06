import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardCardAgingPrefsFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'powerUps'>
  & {
    boardPlugins: Array<(
      { __typename: 'BoardPlugin' }
      & Pick<Types.BoardPlugin, 'id' | 'idPlugin'>
    )>,
    prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'cardAging'>
    )>,
  }
);

export const BoardCardAgingPrefsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardCardAgingPrefs' },
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
            name: { kind: 'Name', value: 'boardPlugins' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idPlugin' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'powerUps' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'cardAging' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardCardAgingPrefsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardCardAgingPrefsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardCardAgingPrefsFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardCardAgingPrefsFragment>, 'data'> {
  data?: BoardCardAgingPrefsFragment;
}

export const useBoardCardAgingPrefsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardCardAgingPrefsFragmentOptions): UseBoardCardAgingPrefsFragmentResult => {
  const result = Apollo.useFragment<BoardCardAgingPrefsFragment>({
    ...options,
    fragment: BoardCardAgingPrefsFragmentDoc,
    fragmentName: 'BoardCardAgingPrefs',
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

  return { ...result, data: result.data as BoardCardAgingPrefsFragment };
};
