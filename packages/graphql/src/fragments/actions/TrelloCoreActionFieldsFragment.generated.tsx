import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloCardActionDataFields_TrelloAddAttachmentToCardAction_Fragment = (
  { __typename: 'TrelloAddAttachmentToCardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloAddChecklistToCardAction_Fragment = (
  { __typename: 'TrelloAddChecklistToCardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloAddMemberToCardAction_Fragment = (
  { __typename: 'TrelloAddMemberToCardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloCommentCardAction_Fragment = (
  { __typename: 'TrelloCommentCardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloCopyCardAction_Fragment = (
  { __typename: 'TrelloCopyCardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloCopyCommentCardAction_Fragment = (
  { __typename: 'TrelloCopyCommentCardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloCopyInboxCardAction_Fragment = (
  { __typename: 'TrelloCopyInboxCardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloCreateCardAction_Fragment = (
  { __typename: 'TrelloCreateCardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloCreateCardFromCheckItemAction_Fragment = (
  { __typename: 'TrelloCreateCardFromCheckItemAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloCreateCardFromEmailAction_Fragment = (
  { __typename: 'TrelloCreateCardFromEmailAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloCreateInboxCardAction_Fragment = (
  { __typename: 'TrelloCreateInboxCardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloDeleteAttachmentFromCardAction_Fragment = (
  { __typename: 'TrelloDeleteAttachmentFromCardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloMoveCardAction_Fragment = (
  { __typename: 'TrelloMoveCardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloMoveCardToBoardAction_Fragment = (
  { __typename: 'TrelloMoveCardToBoardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloMoveInboxCardToBoardAction_Fragment = (
  { __typename: 'TrelloMoveInboxCardToBoardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloRemoveChecklistFromCardAction_Fragment = (
  { __typename: 'TrelloRemoveChecklistFromCardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloRemoveMemberFromCardAction_Fragment = (
  { __typename: 'TrelloRemoveMemberFromCardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloUpdateCardClosedAction_Fragment = (
  { __typename: 'TrelloUpdateCardClosedAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloUpdateCardCompleteAction_Fragment = (
  { __typename: 'TrelloUpdateCardCompleteAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloUpdateCardDueAction_Fragment = (
  { __typename: 'TrelloUpdateCardDueAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloUpdateCardRecurrenceRuleAction_Fragment = (
  { __typename: 'TrelloUpdateCardRecurrenceRuleAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloUpdateCheckItemStateOnCardAction_Fragment = (
  { __typename: 'TrelloUpdateCheckItemStateOnCardAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFields_TrelloUpdateCustomFieldItemAction_Fragment = (
  { __typename: 'TrelloUpdateCustomFieldItemAction' }
  & { card?: Types.Maybe<(
    { __typename: 'TrelloCard' }
    & Pick<Types.TrelloCard, 'id'>
  )> }
);

export type TrelloCardActionDataFieldsFragment =
  | TrelloCardActionDataFields_TrelloAddAttachmentToCardAction_Fragment
  | TrelloCardActionDataFields_TrelloAddChecklistToCardAction_Fragment
  | TrelloCardActionDataFields_TrelloAddMemberToCardAction_Fragment
  | TrelloCardActionDataFields_TrelloCommentCardAction_Fragment
  | TrelloCardActionDataFields_TrelloCopyCardAction_Fragment
  | TrelloCardActionDataFields_TrelloCopyCommentCardAction_Fragment
  | TrelloCardActionDataFields_TrelloCopyInboxCardAction_Fragment
  | TrelloCardActionDataFields_TrelloCreateCardAction_Fragment
  | TrelloCardActionDataFields_TrelloCreateCardFromCheckItemAction_Fragment
  | TrelloCardActionDataFields_TrelloCreateCardFromEmailAction_Fragment
  | TrelloCardActionDataFields_TrelloCreateInboxCardAction_Fragment
  | TrelloCardActionDataFields_TrelloDeleteAttachmentFromCardAction_Fragment
  | TrelloCardActionDataFields_TrelloMoveCardAction_Fragment
  | TrelloCardActionDataFields_TrelloMoveCardToBoardAction_Fragment
  | TrelloCardActionDataFields_TrelloMoveInboxCardToBoardAction_Fragment
  | TrelloCardActionDataFields_TrelloRemoveChecklistFromCardAction_Fragment
  | TrelloCardActionDataFields_TrelloRemoveMemberFromCardAction_Fragment
  | TrelloCardActionDataFields_TrelloUpdateCardClosedAction_Fragment
  | TrelloCardActionDataFields_TrelloUpdateCardCompleteAction_Fragment
  | TrelloCardActionDataFields_TrelloUpdateCardDueAction_Fragment
  | TrelloCardActionDataFields_TrelloUpdateCardRecurrenceRuleAction_Fragment
  | TrelloCardActionDataFields_TrelloUpdateCheckItemStateOnCardAction_Fragment
  | TrelloCardActionDataFields_TrelloUpdateCustomFieldItemAction_Fragment
;

export type TrelloCoreActionFields_TrelloAddAttachmentToCardAction_Fragment = (
  { __typename: 'TrelloAddAttachmentToCardAction' }
  & Pick<
    Types.TrelloAddAttachmentToCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloAddChecklistToCardAction_Fragment = (
  { __typename: 'TrelloAddChecklistToCardAction' }
  & Pick<
    Types.TrelloAddChecklistToCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloAddMemberToCardAction_Fragment = (
  { __typename: 'TrelloAddMemberToCardAction' }
  & Pick<
    Types.TrelloAddMemberToCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloCommentCardAction_Fragment = (
  { __typename: 'TrelloCommentCardAction' }
  & Pick<
    Types.TrelloCommentCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloCopyCardAction_Fragment = (
  { __typename: 'TrelloCopyCardAction' }
  & Pick<
    Types.TrelloCopyCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloCopyCommentCardAction_Fragment = (
  { __typename: 'TrelloCopyCommentCardAction' }
  & Pick<
    Types.TrelloCopyCommentCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloCopyInboxCardAction_Fragment = (
  { __typename: 'TrelloCopyInboxCardAction' }
  & Pick<
    Types.TrelloCopyInboxCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloCreateCardAction_Fragment = (
  { __typename: 'TrelloCreateCardAction' }
  & Pick<
    Types.TrelloCreateCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloCreateCardFromCheckItemAction_Fragment = (
  { __typename: 'TrelloCreateCardFromCheckItemAction' }
  & Pick<
    Types.TrelloCreateCardFromCheckItemAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloCreateCardFromEmailAction_Fragment = (
  { __typename: 'TrelloCreateCardFromEmailAction' }
  & Pick<
    Types.TrelloCreateCardFromEmailAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloCreateInboxCardAction_Fragment = (
  { __typename: 'TrelloCreateInboxCardAction' }
  & Pick<
    Types.TrelloCreateInboxCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloDeleteAttachmentFromCardAction_Fragment = (
  { __typename: 'TrelloDeleteAttachmentFromCardAction' }
  & Pick<
    Types.TrelloDeleteAttachmentFromCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloMoveCardAction_Fragment = (
  { __typename: 'TrelloMoveCardAction' }
  & Pick<
    Types.TrelloMoveCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloMoveCardToBoardAction_Fragment = (
  { __typename: 'TrelloMoveCardToBoardAction' }
  & Pick<
    Types.TrelloMoveCardToBoardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloMoveInboxCardToBoardAction_Fragment = (
  { __typename: 'TrelloMoveInboxCardToBoardAction' }
  & Pick<
    Types.TrelloMoveInboxCardToBoardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloRemoveChecklistFromCardAction_Fragment = (
  { __typename: 'TrelloRemoveChecklistFromCardAction' }
  & Pick<
    Types.TrelloRemoveChecklistFromCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloRemoveMemberFromCardAction_Fragment = (
  { __typename: 'TrelloRemoveMemberFromCardAction' }
  & Pick<
    Types.TrelloRemoveMemberFromCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloUpdateCardClosedAction_Fragment = (
  { __typename: 'TrelloUpdateCardClosedAction' }
  & Pick<
    Types.TrelloUpdateCardClosedAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloUpdateCardCompleteAction_Fragment = (
  { __typename: 'TrelloUpdateCardCompleteAction' }
  & Pick<
    Types.TrelloUpdateCardCompleteAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloUpdateCardDueAction_Fragment = (
  { __typename: 'TrelloUpdateCardDueAction' }
  & Pick<
    Types.TrelloUpdateCardDueAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloUpdateCardRecurrenceRuleAction_Fragment = (
  { __typename: 'TrelloUpdateCardRecurrenceRuleAction' }
  & Pick<
    Types.TrelloUpdateCardRecurrenceRuleAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloUpdateCheckItemStateOnCardAction_Fragment = (
  { __typename: 'TrelloUpdateCheckItemStateOnCardAction' }
  & Pick<
    Types.TrelloUpdateCheckItemStateOnCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFields_TrelloUpdateCustomFieldItemAction_Fragment = (
  { __typename: 'TrelloUpdateCustomFieldItemAction' }
  & Pick<
    Types.TrelloUpdateCustomFieldItemAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
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

export type TrelloCoreActionFieldsFragment =
  | TrelloCoreActionFields_TrelloAddAttachmentToCardAction_Fragment
  | TrelloCoreActionFields_TrelloAddChecklistToCardAction_Fragment
  | TrelloCoreActionFields_TrelloAddMemberToCardAction_Fragment
  | TrelloCoreActionFields_TrelloCommentCardAction_Fragment
  | TrelloCoreActionFields_TrelloCopyCardAction_Fragment
  | TrelloCoreActionFields_TrelloCopyCommentCardAction_Fragment
  | TrelloCoreActionFields_TrelloCopyInboxCardAction_Fragment
  | TrelloCoreActionFields_TrelloCreateCardAction_Fragment
  | TrelloCoreActionFields_TrelloCreateCardFromCheckItemAction_Fragment
  | TrelloCoreActionFields_TrelloCreateCardFromEmailAction_Fragment
  | TrelloCoreActionFields_TrelloCreateInboxCardAction_Fragment
  | TrelloCoreActionFields_TrelloDeleteAttachmentFromCardAction_Fragment
  | TrelloCoreActionFields_TrelloMoveCardAction_Fragment
  | TrelloCoreActionFields_TrelloMoveCardToBoardAction_Fragment
  | TrelloCoreActionFields_TrelloMoveInboxCardToBoardAction_Fragment
  | TrelloCoreActionFields_TrelloRemoveChecklistFromCardAction_Fragment
  | TrelloCoreActionFields_TrelloRemoveMemberFromCardAction_Fragment
  | TrelloCoreActionFields_TrelloUpdateCardClosedAction_Fragment
  | TrelloCoreActionFields_TrelloUpdateCardCompleteAction_Fragment
  | TrelloCoreActionFields_TrelloUpdateCardDueAction_Fragment
  | TrelloCoreActionFields_TrelloUpdateCardRecurrenceRuleAction_Fragment
  | TrelloCoreActionFields_TrelloUpdateCheckItemStateOnCardAction_Fragment
  | TrelloCoreActionFields_TrelloUpdateCustomFieldItemAction_Fragment
;

export const TrelloCardActionDataFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
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
  ],
} as unknown as DocumentNode;
export const TrelloCoreActionFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
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

interface UseTrelloCardActionDataFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloCardActionDataFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloCardActionDataFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloCardActionDataFieldsFragment>,
    'data'
  > {
  data?: TrelloCardActionDataFieldsFragment;
}

export const useTrelloCardActionDataFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloCardActionDataFieldsFragmentOptions): UseTrelloCardActionDataFieldsFragmentResult => {
  const result = Apollo.useFragment<TrelloCardActionDataFieldsFragment>({
    ...options,
    fragment: TrelloCardActionDataFieldsFragmentDoc,
    fragmentName: 'TrelloCardActionDataFields',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloCardActionData', ...from },
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

  return { ...result, data: result.data as TrelloCardActionDataFieldsFragment };
};
