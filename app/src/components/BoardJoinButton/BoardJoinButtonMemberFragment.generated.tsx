import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardJoinButtonMemberFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id' | 'confirmed' | 'idPremOrgsAdmin'>
);

export const BoardJoinButtonMemberFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardJoinButtonMember' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idPremOrgsAdmin' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardJoinButtonMemberFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardJoinButtonMemberFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardJoinButtonMemberFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<BoardJoinButtonMemberFragment>,
    'data'
  > {
  data?: BoardJoinButtonMemberFragment;
}

export const useBoardJoinButtonMemberFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardJoinButtonMemberFragmentOptions): UseBoardJoinButtonMemberFragmentResult => {
  const result = Apollo.useFragment<BoardJoinButtonMemberFragment>({
    ...options,
    fragment: BoardJoinButtonMemberFragmentDoc,
    fragmentName: 'BoardJoinButtonMember',
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

  return { ...result, data: result.data as BoardJoinButtonMemberFragment };
};
