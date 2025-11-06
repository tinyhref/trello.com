import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardInvitedMemberFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id' | 'memberType'>
);

export const BoardInvitedMemberFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardInvitedMember' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberType' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardInvitedMemberFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardInvitedMemberFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardInvitedMemberFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardInvitedMemberFragment>, 'data'> {
  data?: BoardInvitedMemberFragment;
}

export const useBoardInvitedMemberFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardInvitedMemberFragmentOptions): UseBoardInvitedMemberFragmentResult => {
  const result = Apollo.useFragment<BoardInvitedMemberFragment>({
    ...options,
    fragment: BoardInvitedMemberFragmentDoc,
    fragmentName: 'BoardInvitedMember',
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

  return { ...result, data: result.data as BoardInvitedMemberFragment };
};
