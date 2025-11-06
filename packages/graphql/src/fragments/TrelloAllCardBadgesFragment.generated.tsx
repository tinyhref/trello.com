import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloAllCardBadgesFragment = (
  { __typename: 'TrelloCardBadges' }
  & Pick<
    Types.TrelloCardBadges,
    | 'attachments'
    | 'checkItems'
    | 'checkItemsChecked'
    | 'checkItemsEarliestDue'
    | 'comments'
    | 'description'
    | 'externalSource'
    | 'lastUpdatedByAi'
    | 'location'
    | 'maliciousAttachments'
    | 'startedAt'
    | 'votes'
  >
  & {
    attachmentsByType?: Types.Maybe<(
      { __typename: 'TrelloCardAttachmentsByType' }
      & { trello?: Types.Maybe<(
        { __typename: 'TrelloCardAttachmentsCount' }
        & Pick<Types.TrelloCardAttachmentsCount, 'board' | 'card'>
      )> }
    )>,
    due?: Types.Maybe<(
      { __typename: 'TrelloCardBadgeDueInfo' }
      & Pick<Types.TrelloCardBadgeDueInfo, 'at' | 'complete'>
    )>,
    viewer?: Types.Maybe<(
      { __typename: 'TrelloCardViewer' }
      & Pick<Types.TrelloCardViewer, 'subscribed' | 'voted'>
    )>,
  }
);

export const TrelloAllCardBadgesFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloAllCardBadges' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCardBadges' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'attachments' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'attachmentsByType' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'trello' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'board' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'card' } },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'checkItems' } },
          { kind: 'Field', name: { kind: 'Name', value: 'checkItemsChecked' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'checkItemsEarliestDue' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'comments' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'due' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'at' } },
                { kind: 'Field', name: { kind: 'Name', value: 'complete' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'externalSource' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastUpdatedByAi' } },
          { kind: 'Field', name: { kind: 'Name', value: 'location' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'maliciousAttachments' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'startedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'viewer' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'subscribed' } },
                { kind: 'Field', name: { kind: 'Name', value: 'voted' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'votes' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseTrelloAllCardBadgesFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloAllCardBadgesFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloAllCardBadgesFragmentResult
  extends Omit<Apollo.UseFragmentResult<TrelloAllCardBadgesFragment>, 'data'> {
  data?: TrelloAllCardBadgesFragment;
}

export const useTrelloAllCardBadgesFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloAllCardBadgesFragmentOptions): UseTrelloAllCardBadgesFragmentResult => {
  const result = Apollo.useFragment<TrelloAllCardBadgesFragment>({
    ...options,
    fragment: TrelloAllCardBadgesFragmentDoc,
    fragmentName: 'TrelloAllCardBadges',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloCardBadges', ...from },
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

  return { ...result, data: result.data as TrelloAllCardBadgesFragment };
};
