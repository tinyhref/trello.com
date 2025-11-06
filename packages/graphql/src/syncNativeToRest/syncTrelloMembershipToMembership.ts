import type { InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';

import type { TrelloBoardMembershipInfo } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncNativeToRestScalars } from './syncNativeToRestScalars';
import { isBool, isEnumString, isString } from './validateHelpers';

const validBoardMembershipTypes = ['ADMIN', 'NORMAL', 'OBSERVER'];

const validWorkspaceMembershipTypes = ['ADMIN', 'NORMAL'];

export const fieldMappings = {
  deactivated: { validate: isBool },
  type: {
    validate: (value: unknown) =>
      isEnumString(value, validBoardMembershipTypes),
    transform: (val: string) => val.toLowerCase(),
    key: 'memberType',
  },
  unconfirmed: { validate: isBool },
  workspaceMemberType: {
    validate: (value: unknown) =>
      value === null || isEnumString(value, validWorkspaceMembershipTypes),
    transform: (val: string) => (isString(val) ? val.toLowerCase() : val),
    key: 'orgMemberType',
    sendValueToSentry: true,
  },
};

/**
 * Given native TrelloBoardMembershipInfo data, writes all membership data to the Board_Membership model
 * in the Apollo Cache
 * @param incoming A partial TrelloBoardMembershipInfo model
 * @param cache The cache to write to
 * @param readField A ReadFieldFunction
 */
export const syncTrelloMembershipToMembership = (
  incoming: RecursivePartial<TrelloBoardMembershipInfo>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  try {
    const membershipId = getObjectIdFromCacheObject(incoming, readField);
    const membership: TargetModel = {
      type: 'Board_Membership',
      id: membershipId,
    };
    syncNativeToRestScalars(
      membership,
      fieldMappings,
      incoming,
      cache,
      readField,
    );
  } catch (err) {
    sendErrorEvent(err);
  }
};
