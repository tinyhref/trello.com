import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardMenuDataFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'closed'>
  & {
    myPrefs: (
      { __typename: 'MyPrefs' }
      & Pick<Types.MyPrefs, 'showSidebar'>
    ),
    prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'permissionLevel'>
    )>,
  }
);

export const BoardMenuDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardMenuData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'myPrefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'showSidebar' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'permissionLevel' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardMenuDataFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<BoardMenuDataFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardMenuDataFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardMenuDataFragment>, 'data'> {
  data?: BoardMenuDataFragment;
}

export const useBoardMenuDataFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardMenuDataFragmentOptions): UseBoardMenuDataFragmentResult => {
  const result = Apollo.useFragment<BoardMenuDataFragment>({
    ...options,
    fragment: BoardMenuDataFragmentDoc,
    fragmentName: 'BoardMenuData',
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

  return { ...result, data: result.data as BoardMenuDataFragment };
};
