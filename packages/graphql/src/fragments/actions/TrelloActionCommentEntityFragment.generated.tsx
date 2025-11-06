import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloActionCommentEntityFieldsFragment = (
  { __typename: 'TrelloActionCommentEntity' }
  & Pick<Types.TrelloActionCommentEntity, 'text' | 'type'>
);

export const TrelloActionCommentEntityFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloActionCommentEntityFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloActionCommentEntity' },
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

interface UseTrelloActionCommentEntityFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloActionCommentEntityFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloActionCommentEntityFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloActionCommentEntityFieldsFragment>,
    'data'
  > {
  data?: TrelloActionCommentEntityFieldsFragment;
}

export const useTrelloActionCommentEntityFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloActionCommentEntityFieldsFragmentOptions): UseTrelloActionCommentEntityFieldsFragmentResult => {
  const result = Apollo.useFragment<TrelloActionCommentEntityFieldsFragment>({
    ...options,
    fragment: TrelloActionCommentEntityFieldsFragmentDoc,
    fragmentName: 'TrelloActionCommentEntityFields',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloActionCommentEntity', ...from },
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
    data: result.data as TrelloActionCommentEntityFieldsFragment,
  };
};
