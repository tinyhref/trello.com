import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloMirrorCardSourceCardIdFragment = (
  { __typename: 'TrelloMirrorCard' }
  & Pick<Types.TrelloMirrorCard, 'id'>
  & { sourceCard?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id' | 'objectId'>
  )> }
);

export const TrelloMirrorCardSourceCardIdFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloMirrorCardSourceCardId' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloMirrorCard' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'sourceCard' },
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

interface UseTrelloMirrorCardSourceCardIdFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloMirrorCardSourceCardIdFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloMirrorCardSourceCardIdFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloMirrorCardSourceCardIdFragment>,
    'data'
  > {
  data?: TrelloMirrorCardSourceCardIdFragment;
}

export const useTrelloMirrorCardSourceCardIdFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloMirrorCardSourceCardIdFragmentOptions): UseTrelloMirrorCardSourceCardIdFragmentResult => {
  const result = Apollo.useFragment<TrelloMirrorCardSourceCardIdFragment>({
    ...options,
    fragment: TrelloMirrorCardSourceCardIdFragmentDoc,
    fragmentName: 'TrelloMirrorCardSourceCardId',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloMirrorCard', ...from },
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
    data: result.data as TrelloMirrorCardSourceCardIdFragment,
  };
};
