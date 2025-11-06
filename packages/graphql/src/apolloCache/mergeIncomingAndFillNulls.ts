import type { FieldFunctionOptions, FieldMergeFunction } from '@apollo/client';

import { getChildNodes } from '../restResourceResolver/queryParsing';

const hasProperty = (obj: object = {}, field: string) => {
  return (
    typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, field)
  );
};

/**
 * Fills in null values in the cache because sometimes api returns undefined.
 * For something like member.nonPublic, the api will send all of the fields that
 * you have personally defined/edited, otherwise omit them. So we need to fill
 * in nulls to prevent cache misses. Because you can't ask server for each field
 * of something like nonPublic, we always use incoming because it's the correct version
 * of the object.
 *
 * @param requiredFields - Optional array of field names that should always be included
 * in the cache, even if not requested or present in incoming data.
 */
export const mergeIncomingAndFillNulls =
  (requiredFields: string[] = []): FieldMergeFunction =>
  (
    _existing: { [key: string]: unknown } | null | undefined,
    _incoming: { [key: string]: unknown } | null | undefined,
    { field }: FieldFunctionOptions,
  ) => {
    const fieldsRequested = (field ? getChildNodes(field) : []).map(
      // eslint-disable-next-line @typescript-eslint/no-shadow
      (field) => field.name.value,
    );

    // existing or incoming can be null or undefined. This can happen
    // because server sends {} if you don't set attributes for an object,
    // such as member.nonPublic. That get's coalesced to null, or existing
    // is just undefined. To guard against that, we default to empty object here.
    const existing = _existing ?? {};
    const incoming = _incoming ?? {};

    const fieldsExisting = Object.keys(existing);
    const fieldsIncoming = Object.keys(incoming);

    return [
      ...fieldsRequested,
      ...fieldsExisting,
      ...fieldsIncoming,
      ...requiredFields,
    ].reduce(
      // eslint-disable-next-line @typescript-eslint/no-shadow
      (acc, field) => {
        if (field === '__typename') {
          return {
            ...acc,
            [field]: incoming[field],
          };
        }

        // we requested it, it came back, use it
        if (hasProperty(incoming, field) && incoming[field] !== undefined) {
          return {
            ...acc,
            [field]: incoming[field],
          };
        }

        // we didn't request it, but we have it existing already
        if (hasProperty(existing, field) && !fieldsRequested.includes(field)) {
          return {
            ...acc,
            [field]: existing[field],
          };
        }

        // If we requested all of this object, and this field didn't come back
        // then the user didn't set it, so set it to null
        return {
          ...acc,
          [field]: null,
        };
      },
      {},
    );
  };
