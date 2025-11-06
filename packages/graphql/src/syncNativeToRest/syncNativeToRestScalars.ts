import type { InMemoryCache, StoreObject } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';
import { gql } from 'graphql-tag';

import { sendErrorEvent } from '@trello/error-reporting';

import type {
  IncomingNativeModel,
  RecursivePartial,
  TargetModel,
} from './cacheModelTypes';
import { InvalidValueError } from './cacheSyncingErrors';

export type ScalarMapping<T> = {
  /**
   * A function that ensures that this value will not throw an error when written to the cache.
   * Called after fetchValue() but before transform(). It should not throw.
   */
  validate: (value: unknown) => boolean;

  /** An optional key name to write to in the cache (e.g. role --> cardRole) */
  key?: string;

  /**
   * An optional transformation to perform on the value before writing it to the cache.
   * This is called after validate() so no further validation is done on the value returned
   * by this function. It should not throw.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: (value: any) => unknown;

  /**
   * An optional function to fetch the value from the incoming native data,
   * in case it's not located at the top level of incoming. Can throw errors.
   * The value output by this function will be the input for validate().
   */
  fetchValue?: (
    incoming: RecursivePartial<T>,
  ) => number | string | null | undefined;

  /**
   * If true, include the value in the error event. Only set to
   * true in cases where the value is not PII/UGC.
   */
  sendValueToSentry?: boolean;
};

export type ScalarFieldMapping<T extends IncomingNativeModel> = Partial<
  Record<keyof T, ScalarMapping<T>>
>;

/**
 * Given native GraphQL data, writes all scalar fields to the model
 * in the Apollo Cache
 * @param typeName The type name of the model to write to
 * @param fieldMappings A mapping of field names to {@link ScalarMapping} objects
 * @param incoming A partial native GraphQL model
 * @param cache The cache to write to
 */
export const syncNativeToRestScalars = <T extends IncomingNativeModel>(
  model: TargetModel,
  fieldMappings: ScalarFieldMapping<T>,
  incoming: RecursivePartial<T> & StoreObject,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  const writeScalarToCache = (scalarName: string, scalarValue: unknown) => {
    const fragment = `fragment ${model.type}${scalarName}Write on ${model.type} {
        ${scalarName}
    }`;

    cache.writeFragment({
      id: cache.identify({ __typename: model.type, id: model.id }),
      fragment: gql(fragment),
      data: {
        // If this entity doesn't exist in the cache yet, then we _must_ provide __typename
        // or the fragment write will fail silently
        __typename: model.type,
        // In case this is the first time writing this entity to the cache,
        // then we should also write its id to the cache (this is not done automatically)
        id: model.id,
        [scalarName]: scalarValue,
      },
    });
  };

  for (const [fieldName, mapping] of Object.entries(fieldMappings)) {
    const { key, validate, transform, fetchValue, sendValueToSentry } =
      mapping as ScalarMapping<T>;
    const mappedKey = key ?? fieldName;

    try {
      const value = fetchValue
        ? fetchValue(incoming)
        : readField(fieldName, incoming);

      if (value !== undefined && validate(value)) {
        const mappedValue = transform ? transform(value) : value;
        writeScalarToCache(mappedKey, mappedValue);
      } else if (value !== undefined) {
        // If validation failed because the value wasn't present, don't send an error event
        sendErrorEvent(
          new InvalidValueError(
            model.type,
            mappedKey,
            value,
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
        new InvalidValueError(
          model.type,
          mappedKey,
          readField(fieldName, incoming),
          model,
        ),
      );
    }
  }
};
