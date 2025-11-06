import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TrelloCardActionsFields_TrelloAddAttachmentToCardAction_Fragment = (
  { __typename: 'TrelloAddAttachmentToCardAction' }
  & Pick<
    Types.TrelloAddAttachmentToCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloAddAttachmentToCardActionDisplayEntities' }
      & {
        attachment?: Types.Maybe<(
          { __typename: 'TrelloActionAttachmentEntity' }
          & Pick<
            Types.TrelloActionAttachmentEntity,
            | 'link'
            | 'objectId'
            | 'text'
            | 'type'
            | 'url'
          >
        )>,
        attachmentPreview?: Types.Maybe<(
          { __typename: 'TrelloActionAttachmentPreviewEntity' }
          & Pick<
            Types.TrelloActionAttachmentPreviewEntity,
            | 'objectId'
            | 'originalUrl'
            | 'previewUrl'
            | 'previewUrl2x'
            | 'type'
          >
        )>,
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

export type TrelloCardActionsFields_TrelloAddChecklistToCardAction_Fragment = (
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

export type TrelloCardActionsFields_TrelloAddMemberToCardAction_Fragment = (
  { __typename: 'TrelloAddMemberToCardAction' }
  & Pick<
    Types.TrelloAddMemberToCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloAddRemoveMemberActionDisplayEntities' }
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
        member?: Types.Maybe<(
          { __typename: 'TrelloActionMemberEntity' }
          & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
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

export type TrelloCardActionsFields_TrelloCommentCardAction_Fragment = (
  { __typename: 'TrelloCommentCardAction' }
  & Pick<
    Types.TrelloCommentCardAction,
    | 'dateLastEdited'
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloCommentCardActionDisplayEntities' }
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
        comment?: Types.Maybe<(
          { __typename: 'TrelloActionCommentEntity' }
          & Pick<Types.TrelloActionCommentEntity, 'text' | 'type'>
        )>,
        contextOn?: Types.Maybe<(
          { __typename: 'TrelloActionTranslatableEntity' }
          & Pick<
            Types.TrelloActionTranslatableEntity,
            | 'contextId'
            | 'hideIfContext'
            | 'translationKey'
            | 'type'
          >
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

export type TrelloCardActionsFields_TrelloCopyCardAction_Fragment = (
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

export type TrelloCardActionsFields_TrelloCopyCommentCardAction_Fragment = (
  { __typename: 'TrelloCopyCommentCardAction' }
  & Pick<
    Types.TrelloCopyCommentCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloCopyCommentCardActionDisplayEntities' }
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
        comment?: Types.Maybe<(
          { __typename: 'TrelloActionCommentEntity' }
          & Pick<Types.TrelloActionCommentEntity, 'text' | 'type'>
        )>,
        memberCreator?: Types.Maybe<(
          { __typename: 'TrelloActionMemberEntity' }
          & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
        )>,
        originalCommenter?: Types.Maybe<(
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

export type TrelloCardActionsFields_TrelloCopyInboxCardAction_Fragment = (
  { __typename: 'TrelloCopyInboxCardAction' }
  & Pick<
    Types.TrelloCopyInboxCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloCopyInboxCardActionDisplayEntities' }
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

export type TrelloCardActionsFields_TrelloCreateCardAction_Fragment = (
  { __typename: 'TrelloCreateCardAction' }
  & Pick<
    Types.TrelloCreateCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloCreateCardActionDisplayEntities' }
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

export type TrelloCardActionsFields_TrelloCreateCardFromCheckItemAction_Fragment = (
  { __typename: 'TrelloCreateCardFromCheckItemAction' }
  & Pick<
    Types.TrelloCreateCardFromCheckItemAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloCreateCardFromCheckItemActionDisplayEntities' }
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

export type TrelloCardActionsFields_TrelloCreateCardFromEmailAction_Fragment = (
  { __typename: 'TrelloCreateCardFromEmailAction' }
  & Pick<
    Types.TrelloCreateCardFromEmailAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloCreateCardFromEmailActionDisplayEntities' }
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

export type TrelloCardActionsFields_TrelloCreateInboxCardAction_Fragment = (
  { __typename: 'TrelloCreateInboxCardAction' }
  & Pick<
    Types.TrelloCreateInboxCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloCreateInboxCardActionDisplayEntities' }
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

export type TrelloCardActionsFields_TrelloDeleteAttachmentFromCardAction_Fragment = (
  { __typename: 'TrelloDeleteAttachmentFromCardAction' }
  & Pick<
    Types.TrelloDeleteAttachmentFromCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloDeleteAttachmentFromCardActionDisplayEntities' }
      & {
        attachment?: Types.Maybe<(
          { __typename: 'TrelloActionAttachmentEntity' }
          & Pick<
            Types.TrelloActionAttachmentEntity,
            | 'link'
            | 'objectId'
            | 'text'
            | 'type'
            | 'url'
          >
        )>,
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

export type TrelloCardActionsFields_TrelloMoveCardAction_Fragment = (
  { __typename: 'TrelloMoveCardAction' }
  & Pick<
    Types.TrelloMoveCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloMoveCardActionDisplayEntities' }
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
        listAfter?: Types.Maybe<(
          { __typename: 'TrelloActionListEntity' }
          & Pick<Types.TrelloActionListEntity, 'text' | 'type'>
        )>,
        listBefore?: Types.Maybe<(
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

export type TrelloCardActionsFields_TrelloMoveCardToBoardAction_Fragment = (
  { __typename: 'TrelloMoveCardToBoardAction' }
  & Pick<
    Types.TrelloMoveCardToBoardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloMoveCardBoardEntities' }
      & {
        board?: Types.Maybe<(
          { __typename: 'TrelloActionBoardEntity' }
          & Pick<
            Types.TrelloActionBoardEntity,
            | 'objectId'
            | 'shortLink'
            | 'text'
            | 'type'
          >
        )>,
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

export type TrelloCardActionsFields_TrelloMoveInboxCardToBoardAction_Fragment = (
  { __typename: 'TrelloMoveInboxCardToBoardAction' }
  & Pick<
    Types.TrelloMoveInboxCardToBoardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloMoveInboxCardToBoardEntities' }
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

export type TrelloCardActionsFields_TrelloRemoveChecklistFromCardAction_Fragment = (
  { __typename: 'TrelloRemoveChecklistFromCardAction' }
  & Pick<
    Types.TrelloRemoveChecklistFromCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloRemoveChecklistFromCardDisplayEntities' }
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

export type TrelloCardActionsFields_TrelloRemoveMemberFromCardAction_Fragment = (
  { __typename: 'TrelloRemoveMemberFromCardAction' }
  & Pick<
    Types.TrelloRemoveMemberFromCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloAddRemoveMemberActionDisplayEntities' }
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
        member?: Types.Maybe<(
          { __typename: 'TrelloActionMemberEntity' }
          & Pick<Types.TrelloActionMemberEntity, 'text' | 'type'>
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

export type TrelloCardActionsFields_TrelloUpdateCardClosedAction_Fragment = (
  { __typename: 'TrelloUpdateCardClosedAction' }
  & Pick<
    Types.TrelloUpdateCardClosedAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloUpdateCardClosedActionDisplayEntities' }
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

export type TrelloCardActionsFields_TrelloUpdateCardCompleteAction_Fragment = (
  { __typename: 'TrelloUpdateCardCompleteAction' }
  & Pick<
    Types.TrelloUpdateCardCompleteAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloUpdateCardCompleteActionDisplayEntities' }
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

export type TrelloCardActionsFields_TrelloUpdateCardDueAction_Fragment = (
  { __typename: 'TrelloUpdateCardDueAction' }
  & Pick<
    Types.TrelloUpdateCardDueAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloUpdateCardDueActionDisplayEntities' }
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
        date?: Types.Maybe<(
          { __typename: 'TrelloActionDateEntity' }
          & Pick<Types.TrelloActionDateEntity, 'date' | 'type'>
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

export type TrelloCardActionsFields_TrelloUpdateCardRecurrenceRuleAction_Fragment = { __typename: 'TrelloUpdateCardRecurrenceRuleAction' };

export type TrelloCardActionsFields_TrelloUpdateCheckItemStateOnCardAction_Fragment = (
  { __typename: 'TrelloUpdateCheckItemStateOnCardAction' }
  & Pick<
    Types.TrelloUpdateCheckItemStateOnCardAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloUpdateCheckItemStateOnCardActionDisplayEntities' }
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
        checkItem?: Types.Maybe<(
          { __typename: 'TrelloActionCheckItemEntity' }
          & Pick<Types.TrelloActionCheckItemEntity, 'text' | 'type'>
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

export type TrelloCardActionsFields_TrelloUpdateCustomFieldItemAction_Fragment = (
  { __typename: 'TrelloUpdateCustomFieldItemAction' }
  & Pick<
    Types.TrelloUpdateCustomFieldItemAction,
    | 'id'
    | 'date'
    | 'displayKey'
    | 'type'
  >
  & {
    displayEntities?: Types.Maybe<(
      { __typename: 'TrelloUpdateCustomFieldItemActionDisplayEntities' }
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
        customFieldItem?: Types.Maybe<(
          { __typename: 'TrelloActionCustomFieldItemEntity' }
          & Pick<Types.TrelloActionCustomFieldItemEntity, 'text' | 'type'>
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

export type TrelloCardActionsFieldsFragment =
  | TrelloCardActionsFields_TrelloAddAttachmentToCardAction_Fragment
  | TrelloCardActionsFields_TrelloAddChecklistToCardAction_Fragment
  | TrelloCardActionsFields_TrelloAddMemberToCardAction_Fragment
  | TrelloCardActionsFields_TrelloCommentCardAction_Fragment
  | TrelloCardActionsFields_TrelloCopyCardAction_Fragment
  | TrelloCardActionsFields_TrelloCopyCommentCardAction_Fragment
  | TrelloCardActionsFields_TrelloCopyInboxCardAction_Fragment
  | TrelloCardActionsFields_TrelloCreateCardAction_Fragment
  | TrelloCardActionsFields_TrelloCreateCardFromCheckItemAction_Fragment
  | TrelloCardActionsFields_TrelloCreateCardFromEmailAction_Fragment
  | TrelloCardActionsFields_TrelloCreateInboxCardAction_Fragment
  | TrelloCardActionsFields_TrelloDeleteAttachmentFromCardAction_Fragment
  | TrelloCardActionsFields_TrelloMoveCardAction_Fragment
  | TrelloCardActionsFields_TrelloMoveCardToBoardAction_Fragment
  | TrelloCardActionsFields_TrelloMoveInboxCardToBoardAction_Fragment
  | TrelloCardActionsFields_TrelloRemoveChecklistFromCardAction_Fragment
  | TrelloCardActionsFields_TrelloRemoveMemberFromCardAction_Fragment
  | TrelloCardActionsFields_TrelloUpdateCardClosedAction_Fragment
  | TrelloCardActionsFields_TrelloUpdateCardCompleteAction_Fragment
  | TrelloCardActionsFields_TrelloUpdateCardDueAction_Fragment
  | TrelloCardActionsFields_TrelloUpdateCardRecurrenceRuleAction_Fragment
  | TrelloCardActionsFields_TrelloUpdateCheckItemStateOnCardAction_Fragment
  | TrelloCardActionsFields_TrelloUpdateCustomFieldItemAction_Fragment
;

export const TrelloCardActionsFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloCardActionsFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCardActions' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloAddAttachmentToCardAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloAddAttachmentToCardActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloAddChecklistToCardAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloAddChecklistToCardActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloAddMemberToCardAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloAddMemberToCardActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloCommentCardAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloCommentCardActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloCopyCardAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'TrelloCopyCardActionFields' },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloCopyCommentCardAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloCopyCommentCardActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloCopyInboxCardAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloCopyInboxCardActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloCreateCardAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'TrelloCreateCardActionFields' },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'TrelloCreateCardFromCheckItemAction',
              },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloCreateCardFromCheckItemActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloCreateCardFromEmailAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloCreateCardFromEmailActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloCreateInboxCardAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloCreateInboxCardActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'TrelloDeleteAttachmentFromCardAction',
              },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloDeleteAttachmentFromCardActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloMoveCardAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'TrelloMoveCardActionFields' },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloMoveCardToBoardAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloMoveCardToBoardActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloMoveInboxCardToBoardAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloMoveInboxCardToBoardActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'TrelloRemoveChecklistFromCardAction',
              },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloRemoveChecklistFromCardActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloRemoveMemberFromCardAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloRemoveMemberFromCardActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloUpdateCardClosedAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloUpdateCardClosedActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloUpdateCardCompleteAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloUpdateCardCompleteActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TrelloUpdateCardDueAction' },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloUpdateCardDueActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'TrelloUpdateCheckItemStateOnCardAction',
              },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloUpdateCheckItemStateOnCardActionFields',
                  },
                },
              ],
            },
          },
          {
            kind: 'InlineFragment',
            typeCondition: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'TrelloUpdateCustomFieldItemAction',
              },
            },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: {
                    kind: 'Name',
                    value: 'TrelloUpdateCustomFieldItemActionFields',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TrelloAddAttachmentToCardActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloAddAttachmentToCardAction' },
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
                  name: { kind: 'Name', value: 'attachment' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TrelloActionAttachmentEntityFields',
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'attachmentPreview' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'objectId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'originalUrl' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'previewUrl' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'previewUrl2x' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    ],
                  },
                },
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
      name: { kind: 'Name', value: 'TrelloAddMemberToCardActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloAddMemberToCardAction' },
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
                  name: { kind: 'Name', value: 'member' },
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
      name: { kind: 'Name', value: 'TrelloCommentCardActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCommentCardAction' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'dateLastEdited' } },
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
                  name: { kind: 'Name', value: 'comment' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TrelloActionCommentEntityFields',
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'contextOn' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'contextId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hideIfContext' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'translationKey' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
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
      name: { kind: 'Name', value: 'TrelloCopyCommentCardActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCopyCommentCardAction' },
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
                  name: { kind: 'Name', value: 'comment' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TrelloActionCommentEntityFields',
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'originalCommenter' },
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
      name: { kind: 'Name', value: 'TrelloCopyInboxCardActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCopyInboxCardAction' },
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
      name: { kind: 'Name', value: 'TrelloCreateCardActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCreateCardAction' },
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
      name: {
        kind: 'Name',
        value: 'TrelloCreateCardFromCheckItemActionFields',
      },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCreateCardFromCheckItemAction' },
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
      name: { kind: 'Name', value: 'TrelloCreateCardFromEmailActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCreateCardFromEmailAction' },
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
      name: { kind: 'Name', value: 'TrelloCreateInboxCardActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloCreateInboxCardAction' },
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
      name: {
        kind: 'Name',
        value: 'TrelloDeleteAttachmentFromCardActionFields',
      },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloDeleteAttachmentFromCardAction' },
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
                  name: { kind: 'Name', value: 'attachment' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TrelloActionAttachmentEntityFields',
                        },
                      },
                    ],
                  },
                },
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
      name: { kind: 'Name', value: 'TrelloMoveCardActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloMoveCardAction' },
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
                  name: { kind: 'Name', value: 'listAfter' },
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
                  name: { kind: 'Name', value: 'listBefore' },
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
      name: { kind: 'Name', value: 'TrelloMoveCardToBoardActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloMoveCardToBoardAction' },
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
                  name: { kind: 'Name', value: 'board' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TrelloActionBoardEntityFields',
                        },
                      },
                    ],
                  },
                },
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
      name: { kind: 'Name', value: 'TrelloActionBoardEntityFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloActionBoardEntity' },
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
      name: { kind: 'Name', value: 'TrelloMoveInboxCardToBoardActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloMoveInboxCardToBoardAction' },
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
      name: {
        kind: 'Name',
        value: 'TrelloRemoveChecklistFromCardActionFields',
      },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloRemoveChecklistFromCardAction' },
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
      name: { kind: 'Name', value: 'TrelloRemoveMemberFromCardActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloRemoveMemberFromCardAction' },
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
                  name: { kind: 'Name', value: 'member' },
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
      name: { kind: 'Name', value: 'TrelloUpdateCardClosedActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloUpdateCardClosedAction' },
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
      name: { kind: 'Name', value: 'TrelloUpdateCardCompleteActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloUpdateCardCompleteAction' },
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
      name: { kind: 'Name', value: 'TrelloUpdateCardDueActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloUpdateCardDueAction' },
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
                  name: { kind: 'Name', value: 'date' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
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
      name: {
        kind: 'Name',
        value: 'TrelloUpdateCheckItemStateOnCardActionFields',
      },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloUpdateCheckItemStateOnCardAction' },
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
                  name: { kind: 'Name', value: 'checkItem' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'text' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
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
      name: { kind: 'Name', value: 'TrelloUpdateCustomFieldItemActionFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TrelloUpdateCustomFieldItemAction' },
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
                  name: { kind: 'Name', value: 'customFieldItem' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'text' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
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
  ],
} as unknown as DocumentNode;

interface UseTrelloCardActionsFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TrelloCardActionsFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTrelloCardActionsFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<TrelloCardActionsFieldsFragment>,
    'data'
  > {
  data?: TrelloCardActionsFieldsFragment;
}

export const useTrelloCardActionsFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTrelloCardActionsFieldsFragmentOptions): UseTrelloCardActionsFieldsFragmentResult => {
  const result = Apollo.useFragment<TrelloCardActionsFieldsFragment>({
    ...options,
    fragment: TrelloCardActionsFieldsFragmentDoc,
    fragmentName: 'TrelloCardActionsFields',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'TrelloCardActions', ...from },
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

  return { ...result, data: result.data as TrelloCardActionsFieldsFragment };
};
