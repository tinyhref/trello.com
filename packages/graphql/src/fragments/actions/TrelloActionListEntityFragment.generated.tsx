import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloActionListEntityFieldsFragment = (
  { __typename: 'TrelloActionListEntity' }
  & Pick<Types.TrelloActionListEntity, 'text' | 'type'>
);

export const TrelloActionListEntityFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloActionListEntityFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloActionListEntity' },
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

interface UseTrelloActionListEntityFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloActionListEntityFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloActionListEntityFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloActionListEntityFieldsFragment>,
    'data'
  > {
  data?: TrelloActionListEntityFieldsFragment;
}

export const useTrelloActionListEntityFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloActionListEntityFieldsFragmentOptions): UseTrelloActionListEntityFieldsFragmentResult => {
  const result = Apollo.useFragment<TrelloActionListEntityFieldsFragment>({
    ...options,
    fragment: TrelloActionListEntityFieldsFragmentDoc,
    fragmentName: 'TrelloActionListEntityFields',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloActionListEntity', ...from },
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
    data: result.data as TrelloActionListEntityFieldsFragment,
  };
};
