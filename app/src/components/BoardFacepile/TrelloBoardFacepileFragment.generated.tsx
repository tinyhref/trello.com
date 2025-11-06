import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloBoardFacepileBoardFragment = (
  { __typename: 'TrelloBoard' }
  & Pick<Types.TrelloBoard, 'id' | 'enterpriseOwned' | 'name'>
  & {
    enterprise?: Types.Maybe<(
      { __typename: 'TrelloEnterprise' }
      & Pick<Types.TrelloEnterprise, 'id'>
    )>,
    prefs: (
      { __typename: 'TrelloBoardPrefs' }
      & Pick<Types.TrelloBoardPrefs, 'canInvite' | 'invitations'>
    ),
    workspace?: Types.Maybe<(
      { __typename: 'TrelloWorkspace' }
      & Pick<Types.TrelloWorkspace, 'id' | 'objectId' | 'offering'>
    )>,
  }
);

export const TrelloBoardFacepileBoardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloBoardFacepileBoard' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'enterpriseOwned' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'canInvite' } },
                { kind: 'Field', name: { kind: 'Name', value: 'invitations' } },
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
                { kind: 'Field', name: { kind: 'Name', value: 'offering' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseTrelloBoardFacepileBoardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloBoardFacepileBoardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloBoardFacepileBoardFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloBoardFacepileBoardFragment>,
    'data'
  > {
  data?: TrelloBoardFacepileBoardFragment;
}

export const useTrelloBoardFacepileBoardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloBoardFacepileBoardFragmentOptions): UseTrelloBoardFacepileBoardFragmentResult => {
  const result = Apollo.useFragment<TrelloBoardFacepileBoardFragment>({
    ...options,
    fragment: TrelloBoardFacepileBoardFragmentDoc,
    fragmentName: 'TrelloBoardFacepileBoard',
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

  return { ...result, data: result.data as TrelloBoardFacepileBoardFragment };
};
