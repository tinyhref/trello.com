import type { InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';

import type { TrelloEmoji, TrelloMember, TrelloReaction } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncNativeNestedObjectToRest } from './syncNativeNestedObjectToRest';
import { syncNativeToRestScalars } from './syncNativeToRestScalars';
import { isObjectId, isString } from './validateHelpers';

function generateMemberData(id: string, field: string, value: unknown) {
  return {
    __typename: 'Reaction',
    id,
    member: {
      __typename: 'Member',
      [field]: value,
    },
  };
}

function generateEmojiData(id: string, field: string, value: unknown) {
  return {
    __typename: 'Reaction',
    id,
    emoji: {
      __typename: 'Reaction_Emoji',
      [field]: value,
    },
  };
}

function generateEmojiFragment(field: string) {
  return `fragment Reaction_EmojiSync on Reaction {
      id
      emoji {
        ${field}
      }
  }`;
}

function generateMemberFragment(field: string) {
  return `fragment MemberWrite on Reaction {
    id
    member {
      ${field}
    }
  }`;
}

/**
 * Given native TrelloReaction data, writes all reaction data to the Reaction model
 * in the Apollo Cache
 * @param incoming A partial TrelloReaction model
 * @param cache The cache to write to
 * @returns the reaction that was synced, or null if error
 */
export const syncTrelloReactionToReaction = (
  incoming: RecursivePartial<TrelloReaction>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
): TargetModel | undefined => {
  try {
    const reactionId = getObjectIdFromCacheObject(incoming, readField);
    const reaction: TargetModel = { type: 'Reaction', id: reactionId };

    // Maybe since its just ID, do i need this?
    syncNativeToRestScalars(
      reaction,
      {
        objectId: { validate: isObjectId, key: 'id' },
      },
      incoming,
      cache,
      readField,
    );

    const emoji = readField<TrelloEmoji | null>('emoji', incoming);
    const member = readField<TrelloMember | null>('member', incoming);

    if (!emoji || !member) {
      return;
    }

    // Sync emoji nested field
    syncNativeNestedObjectToRest(
      reaction,
      {
        name: { validate: isString },
        native: { validate: isString },
        shortName: { validate: isString },
        unified: { validate: isString },
        skinVariation: {
          validate: (value: unknown) => {
            return value ? isString(value) : true;
          },
        },
      },
      generateEmojiFragment,
      generateEmojiData,
      emoji,
      cache,
    );

    // sync member nested field
    syncNativeNestedObjectToRest(
      reaction,
      {
        objectId: {
          validate: (value: unknown) => {
            return isObjectId(value);
          },
          key: 'id',
        },
      },
      generateMemberFragment,
      generateMemberData,
      member,
      cache,
    );
    return reaction;
  } catch (err) {
    sendErrorEvent(err);
  }
};
