import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MirrorCardMembersFragment = (
  { __typename: 'Card' }
  & Pick<
    Types.Card,
    | 'id'
    | 'idBoard'
    | 'idList'
    | 'idMembers'
  >
);

export const MirrorCardMembersFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MirrorCardMembers' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idBoard' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idList' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idMembers' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMirrorCardMembersFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MirrorCardMembersFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMirrorCardMembersFragmentResult
  extends Omit<Apollo.UseFragmentResult<MirrorCardMembersFragment>, 'data'> {
  data?: MirrorCardMembersFragment;
}

export const useMirrorCardMembersFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMirrorCardMembersFragmentOptions): UseMirrorCardMembersFragmentResult => {
  const result = Apollo.useFragment<MirrorCardMembersFragment>({
    ...options,
    fragment: MirrorCardMembersFragmentDoc,
    fragmentName: 'MirrorCardMembers',
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

  return { ...result, data: result.data as MirrorCardMembersFragment };
};
