import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type SingleBoardViewFilterPopoverContextFragment = (
  { __typename: 'Board' }
  & Pick<
    Types.Board,
    | 'id'
    | 'closed'
    | 'idOrganization'
    | 'name'
    | 'shortLink'
    | 'url'
  >
  & {
    labels: Array<(
      { __typename: 'Label' }
      & Pick<Types.Label, 'id' | 'color' | 'name'>
    )>,
    members: Array<(
      { __typename: 'Member' }
      & Pick<
        Types.Member,
        | 'id'
        | 'activityBlocked'
        | 'avatarUrl'
        | 'fullName'
        | 'initials'
        | 'username'
      >
      & { nonPublic?: Types.Maybe<(
        { __typename: 'Member_NonPublic' }
        & Pick<Types.Member_NonPublic, 'avatarUrl' | 'fullName' | 'initials'>
      )> }
    )>,
  }
);

export const SingleBoardViewFilterPopoverContextFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SingleBoardViewFilterPopoverContext' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idOrganization' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'labels' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'EnumValue', value: 'all' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'members' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'activityBlocked' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'avatarUrl' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'initials' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nonPublic' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avatarUrl' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fullName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'initials' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'username' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shortLink' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseSingleBoardViewFilterPopoverContextFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      SingleBoardViewFilterPopoverContextFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseSingleBoardViewFilterPopoverContextFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<SingleBoardViewFilterPopoverContextFragment>,
    'data'
  > {
  data?: SingleBoardViewFilterPopoverContextFragment;
}

export const useSingleBoardViewFilterPopoverContextFragment = ({
  from,
  returnPartialData,
  ...options
}: UseSingleBoardViewFilterPopoverContextFragmentOptions): UseSingleBoardViewFilterPopoverContextFragmentResult => {
  const result =
    Apollo.useFragment<SingleBoardViewFilterPopoverContextFragment>({
      ...options,
      fragment: SingleBoardViewFilterPopoverContextFragmentDoc,
      fragmentName: 'SingleBoardViewFilterPopoverContext',
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

  return {
    ...result,
    data: result.data as SingleBoardViewFilterPopoverContextFragment,
  };
};
