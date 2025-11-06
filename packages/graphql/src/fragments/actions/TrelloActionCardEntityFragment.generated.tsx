import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloActionCardEntityFieldsFragment = (
  { __typename: 'TrelloActionCardEntity' }
  & Pick<
    Types.TrelloActionCardEntity,
    | 'objectId'
    | 'shortLink'
    | 'text'
    | 'type'
  >
);

export const TrelloActionCardEntityFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloActionCardEntityFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloActionCardEntity' },
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

interface UseTrelloActionCardEntityFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloActionCardEntityFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloActionCardEntityFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloActionCardEntityFieldsFragment>,
    'data'
  > {
  data?: TrelloActionCardEntityFieldsFragment;
}

export const useTrelloActionCardEntityFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloActionCardEntityFieldsFragmentOptions): UseTrelloActionCardEntityFieldsFragmentResult => {
  const result = Apollo.useFragment<TrelloActionCardEntityFieldsFragment>({
    ...options,
    fragment: TrelloActionCardEntityFieldsFragmentDoc,
    fragmentName: 'TrelloActionCardEntityFields',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloActionCardEntity', ...from },
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
    data: result.data as TrelloActionCardEntityFieldsFragment,
  };
};
