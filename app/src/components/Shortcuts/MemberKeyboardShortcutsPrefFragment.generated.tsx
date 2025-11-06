import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MemberKeyboardShortcutsPrefFragment = (
  { __typename: 'Member' }
  & { prefs?: Types.Maybe<(
    { __typename: 'Member_Prefs' }
    & Pick<Types.Member_Prefs, 'keyboardShortcutsEnabled'>
  )> }
);

export const MemberKeyboardShortcutsPrefFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MemberKeyboardShortcutsPref' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
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
                  name: { kind: 'Name', value: 'keyboardShortcutsEnabled' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMemberKeyboardShortcutsPrefFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MemberKeyboardShortcutsPrefFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMemberKeyboardShortcutsPrefFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<MemberKeyboardShortcutsPrefFragment>,
    'data'
  > {
  data?: MemberKeyboardShortcutsPrefFragment;
}

export const useMemberKeyboardShortcutsPrefFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMemberKeyboardShortcutsPrefFragmentOptions): UseMemberKeyboardShortcutsPrefFragmentResult => {
  const result = Apollo.useFragment<MemberKeyboardShortcutsPrefFragment>({
    ...options,
    fragment: MemberKeyboardShortcutsPrefFragmentDoc,
    fragmentName: 'MemberKeyboardShortcutsPref',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Member', ...from },
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
    data: result.data as MemberKeyboardShortcutsPrefFragment,
  };
};
