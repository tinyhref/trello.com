import type { InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';

import type { TrelloMemberNonPublicData } from '../generated';
import { type TrelloMember } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncNativeNestedObjectToRest } from './syncNativeNestedObjectToRest';
import { syncNativeToRestScalars } from './syncNativeToRestScalars';
import { isString, nullOrString } from './validateHelpers';

/** Exported for testing only! */
export const scalarFieldMappings = {
  avatarUrl: { validate: nullOrString },
  fullName: { validate: nullOrString },
  initials: { validate: nullOrString },
  username: { validate: isString },
};

const generateNonPublicMemberFragment = (field: string) => {
  return `fragment MemberNonPublic${field}Write on Member {
    id
    nonPublic {
      ${field}
    }
  }`;
};

const generateNonPublicMemberData = (
  id: string,
  field: string,
  value: unknown,
) => {
  return {
    __typename: 'Member',
    id,
    nonPublic: {
      __typename: 'Member_NonPublic',
      [field]: value,
    },
  };
};

/**
 * Given native TrelloMember data, writes all member data to the Member model
 * in the Apollo Cache
 * @param incoming A partial TrelloMember model
 * @param cache The cache to write to
 * @param readField A function to read fields from cache references
 */
export const syncTrelloMemberToMember = (
  incoming: RecursivePartial<TrelloMember>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  try {
    const memberId = getObjectIdFromCacheObject(incoming, readField);
    const member: TargetModel = { type: 'Member', id: memberId };

    syncNativeToRestScalars(
      member,
      scalarFieldMappings,
      incoming,
      cache,
      readField,
    );

    const nonPublicData = readField<TrelloMemberNonPublicData>(
      'nonPublicData',
      incoming,
    );
    if (nonPublicData) {
      syncNativeNestedObjectToRest(
        member,
        // We're reusing the scalarFieldMappings because 3 of the 4 fields are the same
        // username will never be present in nonPublicData so that iteration of the loop will never do anything
        // Will refactor this later if we expand scalarFieldMappings to include more fields so that
        // we're not impacting performance
        scalarFieldMappings,
        generateNonPublicMemberFragment,
        generateNonPublicMemberData,
        nonPublicData,
        cache,
      );
    }
  } catch (err) {
    sendErrorEvent(err);
  }
};
