import type { InMemoryCache } from '@apollo/client';
import { gql } from 'graphql-tag';

import { sendErrorEvent } from '@trello/error-reporting';

import type { TargetModel } from './cacheModelTypes';
import { InvalidValueError } from './cacheSyncingErrors';
import type { ScalarMapping } from './syncNativeToRestScalars';

type ObjectMapping<T> = ScalarMapping<T> & {
  /** An optional function to generate a custom fragment for writing this field to the cache */
  generateFragment?: () => string;
  /**
   * An optional function to generate a custom data for writing this field to the cache.
   * Should not be used for changing the value of the field (use transform instead) but
   * instead used for manipulating the shape of the data that is being written to the cache
   */
  generateData?: (id: string, value: unknown) => Record<string, unknown>;
};

export type NestedObjectFieldMapping<T> = Record<string, ObjectMapping<T>>;

/**
 * Given native GraphQL data, writes all scalar fields on the nested
 * model to the Apollo Cache
 * @param model The {@link TargetModel} to write to
 * @param fieldMapping A mapping of field names to {@link ObjectMapping} objects
 * @param generateNestedFragment A function that returns a GraphQL fragment string for the nested field
 * @param generateNestedObjectData A function that returns the nested object data to write
 * @param incoming A partial nested model containing the data to write
 * @param cache The Apollo cache instance to write to
 */
export const syncNativeNestedObjectToRest = <T>(
  model: TargetModel,
  fieldMapping: NestedObjectFieldMapping<T>,
  generateNestedFragment: (field: string) => string,
  generateNestedObjectData: (
    id: string,
    field: string,
    value: unknown,
  ) => Record<string, unknown>,
  incoming: (Partial<T> & { __typename: string }) | null | undefined,
  cache: InMemoryCache,
) => {
  if (!incoming || !model.id) {
    return;
  }

  for (const [fieldName, value] of Object.entries(incoming)) {
    if (fieldMapping[fieldName]) {
      const {
        key,
        fetchValue,
        validate,
        transform,
        generateFragment,
        generateData,
      } = fieldMapping[fieldName];
      const mappedKey = key ?? fieldName;

      try {
        const fetchedValue = fetchValue ? fetchValue(incoming) : value;

        if (validate(fetchedValue)) {
          const mappedValue = transform
            ? transform(fetchedValue)
            : fetchedValue;

          const fragment = generateFragment
            ? generateFragment()
            : generateNestedFragment(mappedKey);
          const data = generateData
            ? generateData(model.id, mappedValue)
            : generateNestedObjectData(model.id, mappedKey, mappedValue);

          cache.writeFragment({
            id: cache.identify({ __typename: model.type, id: model.id }),
            fragment: gql(fragment),
            data,
          });
        } else if (
          fetchedValue !== undefined &&
          validate(fetchedValue) === false
        ) {
          const sendValueToSentry =
            fieldMapping[fieldName].sendValueToSentry ?? false;

          sendErrorEvent(
            new InvalidValueError(
              incoming.__typename,
              mappedKey,
              fetchedValue,
              model,
              sendValueToSentry,
            ),
            {
              tags: {
                ownershipArea: 'trello-graphql-data',
              },
            },
          );
        }
      } catch (err) {
        sendErrorEvent(
          new InvalidValueError(incoming.__typename, mappedKey, value, model),
          {
            tags: {
              ownershipArea: 'trello-graphql-data',
            },
          },
        );
      }
    }
  }
};
