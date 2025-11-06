import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardToggleMemberPrefsFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id'>
  & {
    memberships: Array<(
      { __typename: 'Board_Membership' }
      & Pick<
        Types.Board_Membership,
        | 'id'
        | 'idMember'
        | 'memberType'
        | 'orgMemberType'
      >
    )>,
    prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'isTemplate' | 'selfJoin'>
    )>,
  }
);

export const BoardToggleMemberPrefsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardToggleMemberPrefs' },
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
            name: { kind: 'Name', value: 'memberships' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idMember' } },
                { kind: 'Field', name: { kind: 'Name', value: 'memberType' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'orgMemberType' },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'selfJoin' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardToggleMemberPrefsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardToggleMemberPrefsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardToggleMemberPrefsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<BoardToggleMemberPrefsFragment>,
    'data'
  > {
  data?: BoardToggleMemberPrefsFragment;
}

export const useBoardToggleMemberPrefsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardToggleMemberPrefsFragmentOptions): UseBoardToggleMemberPrefsFragmentResult => {
  const result = Apollo.useFragment<BoardToggleMemberPrefsFragment>({
    ...options,
    fragment: BoardToggleMemberPrefsFragmentDoc,
    fragmentName: 'BoardToggleMemberPrefs',
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

  return { ...result, data: result.data as BoardToggleMemberPrefsFragment };
};
