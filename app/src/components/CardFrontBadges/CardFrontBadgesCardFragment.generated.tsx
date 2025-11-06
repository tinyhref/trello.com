import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardFrontBadgesCardFragment = (
  { __typename: 'Card' }
  & Pick<
    Types.Card,
    | 'id'
    | 'closed'
    | 'idBoard'
    | 'isTemplate'
  >
  & {
    badges: (
      { __typename: 'Card_Badges' }
      & Pick<
        Types.Card_Badges,
        | 'attachments'
        | 'checkItems'
        | 'checkItemsChecked'
        | 'checkItemsEarliestDue'
        | 'comments'
        | 'description'
        | 'due'
        | 'dueComplete'
        | 'externalSource'
        | 'lastUpdatedByAi'
        | 'location'
        | 'maliciousAttachments'
        | 'start'
        | 'subscribed'
        | 'viewingMemberVoted'
        | 'votes'
      >
      & { attachmentsByType: (
        { __typename: 'Card_Badges_AttachmentsByType' }
        & { trello: (
          { __typename: 'Card_Badges_AttachmentsByType_Trello' }
          & Pick<Types.Card_Badges_AttachmentsByType_Trello, 'board' | 'card'>
        ) }
      ) }
    ),
    recurrenceRule?: Types.Maybe<(
      { __typename: 'Card_RecurrenceRule' }
      & Pick<Types.Card_RecurrenceRule, 'rule'>
    )>,
  }
);

export const CardFrontBadgesCardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardFrontBadgesCard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'badges' },
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'board' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'card' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'checkItems' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'checkItemsChecked' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'checkItemsEarliestDue' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'comments' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'due' } },
                { kind: 'Field', name: { kind: 'Name', value: 'dueComplete' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'externalSource' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'lastUpdatedByAi' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'location' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'maliciousAttachments' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'start' } },
                { kind: 'Field', name: { kind: 'Name', value: 'subscribed' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'viewingMemberVoted' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'votes' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idBoard' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'recurrenceRule' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'rule' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardFrontBadgesCardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardFrontBadgesCardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardFrontBadgesCardFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardFrontBadgesCardFragment>, 'data'> {
  data?: CardFrontBadgesCardFragment;
}

export const useCardFrontBadgesCardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardFrontBadgesCardFragmentOptions): UseCardFrontBadgesCardFragmentResult => {
  const result = Apollo.useFragment<CardFrontBadgesCardFragment>({
    ...options,
    fragment: CardFrontBadgesCardFragmentDoc,
    fragmentName: 'CardFrontBadgesCard',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Card', ...from },
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

  return { ...result, data: result.data as CardFrontBadgesCardFragment };
};
