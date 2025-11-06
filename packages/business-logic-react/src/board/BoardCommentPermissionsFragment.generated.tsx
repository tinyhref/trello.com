import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardCommentPermissionsFragment = (
  { __typename: 'Board' }
  & Pick<
    Types.Board,
    | 'id'
    | 'closed'
    | 'idOrganization'
    | 'premiumFeatures'
  >
  & { prefs?: Types.Maybe<(
    { __typename: 'Board_Prefs' }
    & Pick<
      Types.Board_Prefs,
      | 'comments'
      | 'isTemplate'
      | 'permissionLevel'
      | 'selfJoin'
      | 'voting'
    >
  )> }
);

export const BoardCommentPermissionsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardCommentPermissions' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idOrganization' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'comments' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'permissionLevel' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'selfJoin' } },
                { kind: 'Field', name: { kind: 'Name', value: 'voting' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'premiumFeatures' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardCommentPermissionsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardCommentPermissionsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardCommentPermissionsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<BoardCommentPermissionsFragment>,
    'data'
  > {
  data?: BoardCommentPermissionsFragment;
}

export const useBoardCommentPermissionsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardCommentPermissionsFragmentOptions): UseBoardCommentPermissionsFragmentResult => {
  const result = Apollo.useFragment<BoardCommentPermissionsFragment>({
    ...options,
    fragment: BoardCommentPermissionsFragmentDoc,
    fragmentName: 'BoardCommentPermissions',
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

  return { ...result, data: result.data as BoardCommentPermissionsFragment };
};
