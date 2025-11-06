import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MoveCardMemberBoardsFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id'>
  & { boards: Array<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'idEnterprise' | 'name'>
    & { organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'displayName' | 'offering'>
    )> }
  )> }
);

export const MoveCardMemberBoardsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MoveCardMemberBoards' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'boards' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ListValue',
                  values: [
                    { kind: 'EnumValue', value: 'open' },
                    { kind: 'EnumValue', value: 'starred' },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idEnterprise' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'organization' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'displayName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'offering' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMoveCardMemberBoardsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MoveCardMemberBoardsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMoveCardMemberBoardsFragmentResult
  extends Omit<Apollo.UseFragmentResult<MoveCardMemberBoardsFragment>, 'data'> {
  data?: MoveCardMemberBoardsFragment;
}

export const useMoveCardMemberBoardsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMoveCardMemberBoardsFragmentOptions): UseMoveCardMemberBoardsFragmentResult => {
  const result = Apollo.useFragment<MoveCardMemberBoardsFragment>({
    ...options,
    fragment: MoveCardMemberBoardsFragmentDoc,
    fragmentName: 'MoveCardMemberBoards',
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

  return { ...result, data: result.data as MoveCardMemberBoardsFragment };
};
