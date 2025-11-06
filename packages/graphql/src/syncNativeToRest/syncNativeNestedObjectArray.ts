import { gql } from '@apollo/client';
import type { InMemoryCache } from '@apollo/client';

import { sendErrorEvent } from '@trello/error-reporting';

import type { TargetModel } from './cacheModelTypes';
import { InvalidValueError } from './cacheSyncingErrors';

type ObjectMapping = {
  /** A function that validates that this value will not throw an error when written to the cache */
  validate: (value: unknown) => boolean;
  /** An optional key name to write to in the cache (e.g. imageScaled --> backgroundImageScaled) */
  key?: string | null;
  /** An optional transformation to perform on the value before writing it to the cache */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: (value: any) => unknown;
};

// we should be able to use this to ensure all fields on a type are mapped
type MappedFields<T> = keyof Omit<T, '__typename'> extends string
  ? keyof Omit<T, '__typename'>
  : never;

export type NestedObjectArrayFieldMapping<T> = Record<
  MappedFields<T>,
  ObjectMapping
>;

/**
 * Syncs an array of nested objects (not references) from a native model to the Apollo cache.
 *
 * @param model - The target {@link TargetModel} to write to in the cache
 * @param fieldMapping - Mapping of field names to validation/transformation rules
 * @param generateNestedFragment - Function that returns a GraphQL fragment for the nested object
 * @param generateNestedObjectData - Function that generates the data object to write to the cache
 * @param incoming - Array of nested objects to sync, or null/undefined
 * @param cache - Apollo InMemoryCache instance to write to
 * @param options - Options for if we should map null values
 */
export const syncNativeNestedObjectArray = <T>(
  model: TargetModel,
  fieldMapping: NestedObjectArrayFieldMapping<T>,
  generateNestedFragment: () => string,
  generateNestedObjectData: (
    id: string,
    value: unknown,
  ) => Record<string, unknown>,
  incoming:
    | Readonly<Array<(Partial<T> & { __typename: string }) | null>>
    | null
    | undefined,
  cache: InMemoryCache,
  options?: {
    shouldMapNullFieldToNull?: boolean;
    shouldMapNullArrayItem?: boolean;
  },
) => {
  if (incoming === undefined) {
    return;
  }

  if (incoming === null) {
    if (options?.shouldMapNullFieldToNull) {
      cache.writeFragment({
        id: cache.identify({ __typename: model.type, id: model.id }),
        fragment: gql(generateNestedFragment()),
        data: generateNestedObjectData(model.id, null),
      });
    }
    return;
  }

  const newItems: Array<Record<string, unknown> | null> = [];

  incoming.forEach((item) => {
    if (item === null) {
      if (options?.shouldMapNullArrayItem) {
        newItems.push(null);
      }

      return;
    }
    const newItem: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(item)) {
      if (key in fieldMapping) {
        const mapping = fieldMapping[key as MappedFields<T>];
        const mappedKey = mapping.key ?? key;
        if (mapping?.validate(value)) {
          const mappedValue = mapping?.transform?.(value) ?? value;
          newItem[mappedKey] = mappedValue;
        } else if (value !== undefined && mapping?.validate(value) === false) {
          sendErrorEvent(
            new InvalidValueError(item.__typename, key, value, model),
            { tags: { ownershipArea: 'trello-graphql-data' } },
          );
          // If the value is invalid, we don't want to add it to the newItems array
          return;
        }
      }
    }
    if (Object.keys(newItem).length > 0) {
      newItems.push(newItem);
    }
  });

  const fragment = generateNestedFragment();
  const data = generateNestedObjectData(model.id, newItems);

  cache.writeFragment({
    id: cache.identify({ __typename: model.type, id: model.id }),
    fragment: gql(fragment),
    data,
  });
};
