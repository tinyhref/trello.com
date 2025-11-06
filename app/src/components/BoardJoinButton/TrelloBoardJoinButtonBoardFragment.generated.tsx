import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloBoardJoinButtonBoardFragment = (
  { __typename: 'TrelloBoard' }
  & Pick<Types.TrelloBoard, 'id'>
  & {
    enterprise?: Types.Maybe<(
      { __typename: 'TrelloEnterprise' }
      & Pick<Types.TrelloEnterprise, 'id'>
    )>,
    prefs: (
      { __typename: 'TrelloBoardPrefs' }
      & Pick<Types.TrelloBoardPrefs, 'isTemplate' | 'selfJoin'>
    ),
    workspace?: Types.Maybe<(
      { __typename: 'TrelloWorkspace' }
      & Pick<Types.TrelloWorkspace, 'id' | 'products'>
      & {
        enterprise?: Types.Maybe<(
          { __typename: 'TrelloEnterprise' }
          & Pick<Types.TrelloEnterprise, 'id'>
          & { admins?: Types.Maybe<(
            { __typename: 'TrelloMemberConnection' }
            & { edges?: Types.Maybe<Array<Types.Maybe<(
              { __typename: 'TrelloMemberEdge' }
              & { node?: Types.Maybe<(
                { __typename: 'TrelloMember' }
                & Pick<Types.TrelloMember, 'id'>
              )> }
            )>>> }
          )> }
        )>,
        prefs?: Types.Maybe<(
          { __typename: 'TrelloWorkspacePrefs' }
          & {
            boardDeleteRestrict?: Types.Maybe<(
              { __typename: 'TrelloBoardRestrictions' }
              & Pick<
                Types.TrelloBoardRestrictions,
                | 'enterprise'
                | 'org'
                | 'private'
                | 'public'
              >
            )>,
            boardVisibilityRestrict?: Types.Maybe<(
              { __typename: 'TrelloBoardRestrictions' }
              & Pick<
                Types.TrelloBoardRestrictions,
                | 'enterprise'
                | 'org'
                | 'private'
                | 'public'
              >
            )>,
          }
        )>,
      }
    )>,
  }
);

export const TrelloBoardJoinButtonBoardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloBoardJoinButtonBoard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloBoard' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'enterprise' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'workspace' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'enterprise' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'admins' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'first' },
                            value: { kind: 'IntValue', value: '-1' },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'edges' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'node' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
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
                        name: { kind: 'Name', value: 'boardDeleteRestrict' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'enterprise' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'org' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'private' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'public' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'boardVisibilityRestrict',
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'enterprise' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'org' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'private' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'public' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'products' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseTrelloBoardJoinButtonBoardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloBoardJoinButtonBoardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloBoardJoinButtonBoardFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloBoardJoinButtonBoardFragment>,
    'data'
  > {
  data?: TrelloBoardJoinButtonBoardFragment;
}

export const useTrelloBoardJoinButtonBoardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloBoardJoinButtonBoardFragmentOptions): UseTrelloBoardJoinButtonBoardFragmentResult => {
  const result = Apollo.useFragment<TrelloBoardJoinButtonBoardFragment>({
    ...options,
    fragment: TrelloBoardJoinButtonBoardFragmentDoc,
    fragmentName: 'TrelloBoardJoinButtonBoard',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloBoard', ...from },
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

  return { ...result, data: result.data as TrelloBoardJoinButtonBoardFragment };
};
