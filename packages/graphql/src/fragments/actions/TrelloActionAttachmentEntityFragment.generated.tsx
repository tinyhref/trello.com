import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloActionAttachmentEntityFieldsFragment = (
  { __typename: 'TrelloActionAttachmentEntity' }
  & Pick<
    Types.TrelloActionAttachmentEntity,
    | 'link'
    | 'objectId'
    | 'text'
    | 'type'
    | 'url'
  >
);

export const TrelloActionAttachmentEntityFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloActionAttachmentEntityFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloActionAttachmentEntity' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'link' } },
          { kind: 'Field', name: { kind: 'Name', value: 'objectId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'text' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseTrelloActionAttachmentEntityFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloActionAttachmentEntityFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloActionAttachmentEntityFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloActionAttachmentEntityFieldsFragment>,
    'data'
  > {
  data?: TrelloActionAttachmentEntityFieldsFragment;
}

export const useTrelloActionAttachmentEntityFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloActionAttachmentEntityFieldsFragmentOptions): UseTrelloActionAttachmentEntityFieldsFragmentResult => {
  const result = Apollo.useFragment<TrelloActionAttachmentEntityFieldsFragment>(
    {
      ...options,
      fragment: TrelloActionAttachmentEntityFieldsFragmentDoc,
      fragmentName: 'TrelloActionAttachmentEntityFields',
      from:
        !from || !(from as Apollo.StoreObject)?.id
          ? null
          : { __typename: 'TrelloActionAttachmentEntity', ...from },
    },
  );

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
    data: result.data as TrelloActionAttachmentEntityFieldsFragment,
  };
};
