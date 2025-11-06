import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloBoardVisibilityButtonFragment = (
  { __typename: 'TrelloBoard' }
  & Pick<Types.TrelloBoard, 'id' | 'closed'>
  & {
    enterprise?: Types.Maybe<(
      { __typename: 'TrelloEnterprise' }
      & Pick<Types.TrelloEnterprise, 'id' | 'objectId'>
    )>,
    prefs: (
      { __typename: 'TrelloBoardPrefs' }
      & Pick<Types.TrelloBoardPrefs, 'permissionLevel'>
    ),
    workspace?: Types.Maybe<(
      { __typename: 'TrelloWorkspace' }
      & Pick<Types.TrelloWorkspace, 'id' | 'objectId'>
    )>,
  }
);

export const TrelloBoardVisibilityButtonFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloBoardVisibilityButton' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloBoard' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'enterprise' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'objectId' } },
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
                  name: { kind: 'Name', value: 'permissionLevel' },
                },
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
                { kind: 'Field', name: { kind: 'Name', value: 'objectId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseTrelloBoardVisibilityButtonFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloBoardVisibilityButtonFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloBoardVisibilityButtonFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloBoardVisibilityButtonFragment>,
    'data'
  > {
  data?: TrelloBoardVisibilityButtonFragment;
}

export const useTrelloBoardVisibilityButtonFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloBoardVisibilityButtonFragmentOptions): UseTrelloBoardVisibilityButtonFragmentResult => {
  const result = Apollo.useFragment<TrelloBoardVisibilityButtonFragment>({
    ...options,
    fragment: TrelloBoardVisibilityButtonFragmentDoc,
    fragmentName: 'TrelloBoardVisibilityButton',
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

  return {
    ...result,
    data: result.data as TrelloBoardVisibilityButtonFragment,
  };
};
