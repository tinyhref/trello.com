import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloActionMemberEntityFieldsFragment = (
  { __typename: 'TrelloActionMemberEntity' }
  & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
);

export const TrelloActionMemberEntityFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloActionMemberEntityFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloActionMemberEntity' },
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

interface UseTrelloActionMemberEntityFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloActionMemberEntityFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloActionMemberEntityFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloActionMemberEntityFieldsFragment>,
    'data'
  > {
  data?: TrelloActionMemberEntityFieldsFragment;
}

export const useTrelloActionMemberEntityFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloActionMemberEntityFieldsFragmentOptions): UseTrelloActionMemberEntityFieldsFragmentResult => {
  const result = Apollo.useFragment<TrelloActionMemberEntityFieldsFragment>({
    ...options,
    fragment: TrelloActionMemberEntityFieldsFragmentDoc,
    fragmentName: 'TrelloActionMemberEntityFields',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloActionMemberEntity', ...from },
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
    data: result.data as TrelloActionMemberEntityFieldsFragment,
  };
};
