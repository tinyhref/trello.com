import type { StoreObject } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { dangerouslyGetFeatureGateSync } from '@trello/feature-gate-client';

import { InvalidIdError, MissingIdError } from './cacheSyncingErrors';
import { isObjectId } from './validateHelpers';

/**
 * Simply extracts the last part of an ARI to get an object Id.
 * With NO VERIFICATION
 * @param ari The ARI
 * @returns the objectId, or undefined
 */
export const extractObjectIdFromAri = (ari: string) => ari.split('/').pop();

/**
 * Given a StoreObject representing any object
 * in the cache, extracts the object ID and validates it. The function
 * first tries to derive the object ID from the id field. If the
 * id field is missing, then it tries to read the objectId field
 * of the object.
 * @param incoming A StoreObject
 * @param readField A readField function
 * @returns A stirng objectId
 * @throws {MissingIdError} If the node does not have an id or objectId field
 * @throws {InvalidIdError} If the objectId derived from the id or objectId field is not valid
 */
export const getObjectIdFromCacheObject = (
  incoming: StoreObject,
  readField: ReadFieldFunction,
): string => {
  const ari = readField<string>('id', incoming);
  const typename = incoming.__typename;

  const throwErrorForMissingTypename = dangerouslyGetFeatureGateSync(
    'goo_throw_error_for_missing_typename',
  );
  if (throwErrorForMissingTypename && typeof typename !== 'string') {
    throw new Error(
      `Could not sync object because typename was type ${typeof typename} instead of string`,
    );
  }

  // If the id field is missing, fall back to the objectId field
  const objectId = ari
    ? extractObjectIdFromAri(ari)
    : readField<string>('objectId', incoming);

  if (objectId === undefined) {
    throw new MissingIdError(typename ?? '');
  }

  if (!isObjectId(objectId)) {
    throw new InvalidIdError(typename ?? '', objectId);
  }

  return objectId;
};
