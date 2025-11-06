import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloActionBoardEntityFieldsFragment = (
  { __typename: 'TrelloActionBoardEntity' }
  & Pick<
    Types.TrelloActionBoardEntity,
    | 'objectId'
    | 'shortLink'
    | 'text'
    | 'type'
  >
);

export const TrelloActionBoardEntityFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloActionBoardEntityFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloActionBoardEntity' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'objectId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shortLink' } },
          { kind: 'Field', name: { kind: 'Name', value: 'text' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseTrelloActionBoardEntityFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloActionBoardEntityFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloActionBoardEntityFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloActionBoardEntityFieldsFragment>,
    'data'
  > {
  data?: TrelloActionBoardEntityFieldsFragment;
}

export const useTrelloActionBoardEntityFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloActionBoardEntityFieldsFragmentOptions): UseTrelloActionBoardEntityFieldsFragmentResult => {
  const result = Apollo.useFragment<TrelloActionBoardEntityFieldsFragment>({
    ...options,
    fragment: TrelloActionBoardEntityFieldsFragmentDoc,
    fragmentName: 'TrelloActionBoardEntityFields',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloActionBoardEntity', ...from },
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
    data: result.data as TrelloActionBoardEntityFieldsFragment,
  };
};
