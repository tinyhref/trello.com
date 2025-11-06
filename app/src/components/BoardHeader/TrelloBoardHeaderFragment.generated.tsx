import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloBoardHeaderFragment = (
  { __typename: 'TrelloBoard' }
  & Pick<
    Types.TrelloBoard,
    | 'id'
    | 'closed'
    | 'objectId'
    | 'premiumFeatures'
  >
  & {
    enterprise?: Types.Maybe<(
      { __typename: 'TrelloEnterprise' }
      & Pick<Types.TrelloEnterprise, 'id' | 'objectId'>
    )>,
    prefs: (
      { __typename: 'TrelloBoardPrefs' }
      & Pick<
        Types.TrelloBoardPrefs,
        | 'canInvite'
        | 'invitations'
        | 'isTemplate'
        | 'permissionLevel'
      >
    ),
    viewer?: Types.Maybe<(
      { __typename: 'TrelloBoardViewer' }
      & Pick<Types.TrelloBoardViewer, 'subscribed'>
    )>,
    workspace?: Types.Maybe<(
      { __typename: 'TrelloWorkspace' }
      & Pick<Types.TrelloWorkspace, 'id' | 'name' | 'objectId'>
    )>,
  }
);

export const TrelloBoardHeaderFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloBoardHeader' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'objectId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'canInvite' } },
                { kind: 'Field', name: { kind: 'Name', value: 'invitations' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'permissionLevel' },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'premiumFeatures' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'viewer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'subscribed' } },
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
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'objectId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseTrelloBoardHeaderFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloBoardHeaderFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloBoardHeaderFragmentResult
  extends Omit<Apollo.UseFragmentResult<TrelloBoardHeaderFragment>, 'data'> {
  data?: TrelloBoardHeaderFragment;
}

export const useTrelloBoardHeaderFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloBoardHeaderFragmentOptions): UseTrelloBoardHeaderFragmentResult => {
  const result = Apollo.useFragment<TrelloBoardHeaderFragment>({
    ...options,
    fragment: TrelloBoardHeaderFragmentDoc,
    fragmentName: 'TrelloBoardHeader',
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

  return { ...result, data: result.data as TrelloBoardHeaderFragment };
};
