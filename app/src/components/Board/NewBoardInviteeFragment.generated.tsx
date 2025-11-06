import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type NewBoardInviteeFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id' | 'idBoards' | 'idMemberReferrer'>
  & {
    campaigns: Array<(
      { __typename: 'Campaign' }
      & Pick<Types.Campaign, 'id' | 'dateDismissed' | 'name'>
    )>,
    organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id'>
    )>,
  }
);

export const NewBoardInviteeFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'NewBoardInvitee' },
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
            name: { kind: 'Name', value: 'campaigns' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'dateDismissed' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idBoards' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idMemberReferrer' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'organizations' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseNewBoardInviteeFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      NewBoardInviteeFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseNewBoardInviteeFragmentResult
  extends Omit<Apollo.UseFragmentResult<NewBoardInviteeFragment>, 'data'> {
  data?: NewBoardInviteeFragment;
}

export const useNewBoardInviteeFragment = ({
  from,
  returnPartialData,
  ...options
}: UseNewBoardInviteeFragmentOptions): UseNewBoardInviteeFragmentResult => {
  const result = Apollo.useFragment<NewBoardInviteeFragment>({
    ...options,
    fragment: NewBoardInviteeFragmentDoc,
    fragmentName: 'NewBoardInvitee',
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

  return { ...result, data: result.data as NewBoardInviteeFragment };
};
