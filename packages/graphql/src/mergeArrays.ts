import type { Reference } from '@apollo/client/utilities';

/**
 * Function to merge arrays with deduplication by key
 * Typically used for arrays of References, where the key is __ref,
 * but can also be used objects. Use the getKey parameter to define
 * how to grab the key by which to deduplicate
 */
export const mergeArrays = <T>(
  existing: T[] | null,
  incoming: T[] | null,
  getKey?: (item: T) => string,
): T[] => {
  return [
    ...[existing ?? [], incoming ?? []]
      .flat()
      .filter((item) => item !== undefined)
      .reduce((map: Map<string, T>, item: T) => {
        const key = getKey ? getKey(item) : (item as Reference).__ref;
        map.has(key) || map.set(key, item);
        return map;
      }, new Map<string, T>())
      .values(),
  ];
};
