import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloAddChecklistToCardActionFieldsFragment = (
  { __typename: 'TrelloAddChecklistToCardAction' }
  & Pick<
    Types.TrelloAddChecklistToCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloAddChecklistToCardDisplayEntities' }
      & {
        card?: Types.Maybe<(
          { __typename: 'TrelloActionCardEntity' }
          & Pick<
            Types.TrelloActionCardEntity,
            | 'objectId'
            | 'shortLink'
            | 'text'
            | 'type'
          >
        )>,
        checklist?: Types.Maybe<(
          { __typename: 'TrelloActionChecklistEntity' }
          & Pick<Types.TrelloActionChecklistEntity, 'text' | 'type'>
        )>,
        memberCreator?: Types.Maybe<(
          { __typename: 'TrelloActionMemberEntity' }
          & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
        )>,
      }
    )>,
    card?: Types.Maybe<(
      { __typename: 'TrelloCard' }
      & Pick<Types.TrelloCard, 'id'>
    )>,
    appCreator?: Types.Maybe<(
      { __typename: 'TrelloAppCreator' }
      & Pick<Types.TrelloAppCreator, 'id' | 'name'>
    )>,
    creator?: Types.Maybe<(
      { __typename: 'TrelloMember' }
      & Pick<Types.TrelloMember, 'id'>
    )>,
    reactions?: Types.Maybe<Array<(
      { __typename: 'TrelloReaction' }
      & Pick<Types.TrelloReaction, 'objectId'>
      & {
        emoji?: Types.Maybe<(
          { __typename: 'TrelloEmoji' }
          & Pick<
            Types.TrelloEmoji,
            | 'name'
            | 'native'
            | 'shortName'
            | 'skinVariation'
            | 'unified'
          >
        )>,
        member?: Types.Maybe<(
          { __typename: 'TrelloMember' }
          & Pick<Types.TrelloMember, 'id' | 'objectId'>
        )>,
      }
    )>>,
  }
);

export const TrelloAddChecklistToCardActionFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloAddChecklistToCardActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloAddChecklistToCardAction' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'displayEntities' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'card' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TrelloActionCardEntityFields',
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'checklist' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TrelloActionChecklistEntityFields',
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'memberCreator' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TrelloActionMemberEntityFields',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'TrelloCardActionDataFields' },
          },
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'TrelloCoreActionFields' },
          },
        ],
      },
    },
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
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloCardActionDataFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCardActionData' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'card' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloCoreActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloAction' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'appCreator' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'creator' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'date' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayKey' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'reactions' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'emoji' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'native' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'shortName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'skinVariation' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'unified' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'member' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'objectId' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'objectId' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseTrelloAddChecklistToCardActionFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloAddChecklistToCardActionFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloAddChecklistToCardActionFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloAddChecklistToCardActionFieldsFragment>,
    'data'
  > {
  data?: TrelloAddChecklistToCardActionFieldsFragment;
}

export const useTrelloAddChecklistToCardActionFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloAddChecklistToCardActionFieldsFragmentOptions): UseTrelloAddChecklistToCardActionFieldsFragmentResult => {
  const result =
    Apollo.useFragment<TrelloAddChecklistToCardActionFieldsFragment>({
      ...options,
      fragment: TrelloAddChecklistToCardActionFieldsFragmentDoc,
      fragmentName: 'TrelloAddChecklistToCardActionFields',
      from:
        !from || !(from as Apollo.StoreObject)?.id
          ? null
          : { __typename: 'TrelloAddChecklistToCardAction', ...from },
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
    data: result.data as TrelloAddChecklistToCardActionFieldsFragment,
  };
};
