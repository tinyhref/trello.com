import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloActionChecklistEntityFieldsFragment = (
  { __typename: 'TrelloActionChecklistEntity' }
  & Pick<Types.TrelloActionChecklistEntity, 'text' | 'type'>
);

export const TrelloActionChecklistEntityFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloActionChecklistEntityFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloActionChecklistEntity' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'text' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseTrelloActionChecklistEntityFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloActionChecklistEntityFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloActionChecklistEntityFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloActionChecklistEntityFieldsFragment>,
    'data'
  > {
  data?: TrelloActionChecklistEntityFieldsFragment;
}

export const useTrelloActionChecklistEntityFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloActionChecklistEntityFieldsFragmentOptions): UseTrelloActionChecklistEntityFieldsFragmentResult => {
  const result = Apollo.useFragment<TrelloActionChecklistEntityFieldsFragment>({
    ...options,
    fragment: TrelloActionChecklistEntityFieldsFragmentDoc,
    fragmentName: 'TrelloActionChecklistEntityFields',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloActionChecklistEntity', ...from },
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
    data: result.data as TrelloActionChecklistEntityFieldsFragment,
  };
};
