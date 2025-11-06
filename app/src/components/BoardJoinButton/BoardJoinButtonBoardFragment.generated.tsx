import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardJoinButtonBoardFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'idEnterprise' | 'idOrganization'>
  & {
    organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'idEnterprise' | 'products'>
      & {
        enterprise?: Types.Maybe<(
          { __typename: 'Enterprise' }
          & Pick<Types.Enterprise, 'id' | 'idAdmins'>
        )>,
        prefs: (
          { __typename: 'Organization_Prefs' }
          & {
            boardDeleteRestrict?: Types.Maybe<(
              { __typename: 'Organization_Prefs_BoardDeleteRestrict' }
              & Pick<
                Types.Organization_Prefs_BoardDeleteRestrict,
                | 'enterprise'
                | 'org'
                | 'private'
                | 'public'
              >
            )>,
            boardVisibilityRestrict?: Types.Maybe<(
              { __typename: 'Organization_Prefs_BoardVisibilityRestrict' }
              & Pick<
                Types.Organization_Prefs_BoardVisibilityRestrict,
                | 'enterprise'
                | 'org'
                | 'private'
                | 'public'
              >
            )>,
          }
        ),
      }
    )>,
    prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'isTemplate' | 'selfJoin'>
    )>,
  }
);

export const BoardJoinButtonBoardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardJoinButtonBoard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idEnterprise' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idOrganization' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'organization' },
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
                        name: { kind: 'Name', value: 'idAdmins' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idEnterprise' },
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

interface UseBoardJoinButtonBoardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardJoinButtonBoardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardJoinButtonBoardFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardJoinButtonBoardFragment>, 'data'> {
  data?: BoardJoinButtonBoardFragment;
}

export const useBoardJoinButtonBoardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardJoinButtonBoardFragmentOptions): UseBoardJoinButtonBoardFragmentResult => {
  const result = Apollo.useFragment<BoardJoinButtonBoardFragment>({
    ...options,
    fragment: BoardJoinButtonBoardFragmentDoc,
    fragmentName: 'BoardJoinButtonBoard',
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

  return { ...result, data: result.data as BoardJoinButtonBoardFragment };
};
