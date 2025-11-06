import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardHeaderFragment = (
  { __typename: 'Board' }
  & Pick<
    Types.Board,
    | 'id'
    | 'closed'
    | 'idEnterprise'
    | 'idOrganization'
    | 'nodeId'
    | 'premiumFeatures'
    | 'subscribed'
  >
  & {
    organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'name'>
    )>,
    prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<
        Types.Board_Prefs,
        | 'canInvite'
        | 'invitations'
        | 'isTemplate'
        | 'permissionLevel'
      >
    )>,
  }
);

export const BoardHeaderFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardHeader' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idEnterprise' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idOrganization' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'organization' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
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
          { kind: 'Field', name: { kind: 'Name', value: 'subscribed' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardHeaderFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<BoardHeaderFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardHeaderFragmentResult
  extends Omit<Apollo.UseFragmentResult<BoardHeaderFragment>, 'data'> {
  data?: BoardHeaderFragment;
}

export const useBoardHeaderFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardHeaderFragmentOptions): UseBoardHeaderFragmentResult => {
  const result = Apollo.useFragment<BoardHeaderFragment>({
    ...options,
    fragment: BoardHeaderFragmentDoc,
    fragmentName: 'BoardHeader',
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

  return { ...result, data: result.data as BoardHeaderFragment };
};
