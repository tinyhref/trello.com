import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CurrentCardAttributesFragment = (
  { __typename: 'Card' }
  & Pick<
    Types.Card,
    | 'id'
    | 'cardRole'
    | 'closed'
    | 'idLabels'
    | 'idList'
    | 'idMembers'
    | 'isTemplate'
    | 'name'
    | 'pos'
    | 'url'
  >
  & {
    attachments: Array<(
      { __typename: 'Attachment' }
      & Pick<Types.Attachment, 'id'>
    )>,
    badges: (
      { __typename: 'Card_Badges' }
      & Pick<Types.Card_Badges, 'comments'>
    ),
    checklists: Array<(
      { __typename: 'Checklist' }
      & Pick<Types.Checklist, 'id'>
    )>,
    customFieldItems: Array<(
      { __typename: 'CustomFieldItem' }
      & Pick<Types.CustomFieldItem, 'id'>
    )>,
    stickers: Array<(
      { __typename: 'Sticker' }
      & Pick<Types.Sticker, 'id'>
    )>,
  }
);

export const CurrentCardAttributesFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CurrentCardAttributes' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'attachments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'badges' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'comments' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'cardRole' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'checklists' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFieldItems' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'idLabels' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idList' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idMembers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pos' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'stickers' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCurrentCardAttributesFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CurrentCardAttributesFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCurrentCardAttributesFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<CurrentCardAttributesFragment>,
    'data'
  > {
  data?: CurrentCardAttributesFragment;
}

export const useCurrentCardAttributesFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCurrentCardAttributesFragmentOptions): UseCurrentCardAttributesFragmentResult => {
  const result = Apollo.useFragment<CurrentCardAttributesFragment>({
    ...options,
    fragment: CurrentCardAttributesFragmentDoc,
    fragmentName: 'CurrentCardAttributes',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Card', ...from },
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

  return { ...result, data: result.data as CurrentCardAttributesFragment };
};
