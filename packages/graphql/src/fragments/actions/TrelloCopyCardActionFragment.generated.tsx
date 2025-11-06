import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloCopyCardActionFieldsFragment = (
  { __typename: 'TrelloCopyCardAction' }
  & Pick<
    Types.TrelloCopyCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloCopyCardActionDisplayEntities' }
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
        cardSource?: Types.Maybe<(
          { __typename: 'TrelloActionCardEntity' }
          & Pick<
            Types.TrelloActionCardEntity,
            | 'objectId'
            | 'shortLink'
            | 'text'
            | 'type'
          >
        )>,
        list?: Types.Maybe<(
          { __typename: 'TrelloActionListEntity' }
          & Pick<Types.TrelloActionListEntity, 'text' | 'type'>
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

export const TrelloCopyCardActionFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloCopyCardActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCopyCardAction' },
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
                  name: { kind: 'Name', value: 'cardSource' },
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
                  name: { kind: 'Name', value: 'list' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TrelloActionListEntityFields',
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

interface UseTrelloCopyCardActionFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloCopyCardActionFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloCopyCardActionFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloCopyCardActionFieldsFragment>,
    'data'
  > {
  data?: TrelloCopyCardActionFieldsFragment;
}

export const useTrelloCopyCardActionFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloCopyCardActionFieldsFragmentOptions): UseTrelloCopyCardActionFieldsFragmentResult => {
  const result = Apollo.useFragment<TrelloCopyCardActionFieldsFragment>({
    ...options,
    fragment: TrelloCopyCardActionFieldsFragmentDoc,
    fragmentName: 'TrelloCopyCardActionFields',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloCopyCardAction', ...from },
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

  return { ...result, data: result.data as TrelloCopyCardActionFieldsFragment };
};
