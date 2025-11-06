import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardAutoArchivePrefFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id'>
  & { prefs?: Types.Maybe<(
    { __typename: 'Board_Prefs' }
    & Pick<Types.Board_Prefs, 'autoArchive'>
  )> }
);

export const BoardAutoArchivePrefFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardAutoArchivePref' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'autoArchive' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardAutoArchivePrefFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardAutoArchivePrefFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardAutoArchivePrefFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardAutoArchivePrefFragment>, 'data'> {
  data?: BoardAutoArchivePrefFragment;
}

export const useBoardAutoArchivePrefFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardAutoArchivePrefFragmentOptions): UseBoardAutoArchivePrefFragmentResult => {
  const result = Apollo.useFragment<BoardAutoArchivePrefFragment>({
    ...options,
    fragment: BoardAutoArchivePrefFragmentDoc,
    fragmentName: 'BoardAutoArchivePref',
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

  return { ...result, data: result.data as BoardAutoArchivePrefFragment };
};
