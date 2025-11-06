import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type BoardShareButtonAccessRequestsSpotlightFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
);

export const BoardShareButtonAccessRequestsSpotlightFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BoardShareButtonAccessRequestsSpotlight' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'oneTimeMessagesDismissed' },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseBoardShareButtonAccessRequestsSpotlightFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      BoardShareButtonAccessRequestsSpotlightFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseBoardShareButtonAccessRequestsSpotlightFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<BoardShareButtonAccessRequestsSpotlightFragment>,
    'data'
  > {
  data?: BoardShareButtonAccessRequestsSpotlightFragment;
}

export const useBoardShareButtonAccessRequestsSpotlightFragment = ({
  from,
  returnPartialData,
  ...options
}: UseBoardShareButtonAccessRequestsSpotlightFragmentOptions): UseBoardShareButtonAccessRequestsSpotlightFragmentResult => {
  const result =
    Apollo.useFragment<BoardShareButtonAccessRequestsSpotlightFragment>({
      ...options,
      fragment: BoardShareButtonAccessRequestsSpotlightFragmentDoc,
      fragmentName: 'BoardShareButtonAccessRequestsSpotlight',
      from:
        !from || !(from as Apollo.StoreObject)?.id
          ? null
          : { __typename: 'Member', ...from },
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
    data: result.data as BoardShareButtonAccessRequestsSpotlightFragment,
  };
};
