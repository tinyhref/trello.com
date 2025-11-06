import { type InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';

import type {
  TrelloCustomField,
  TrelloCustomFieldDisplay,
  TrelloCustomFieldOption,
  TrelloCustomFieldOptionValue,
} from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncNativeNestedObjectToRest } from './syncNativeNestedObjectToRest';
import {
  syncNativeToRestScalars,
  type ScalarFieldMapping,
} from './syncNativeToRestScalars';
import { syncNestedModelListReferences } from './syncNestedModelListReferences';
import { isBool, isEnumString, isNumber, isString } from './validateHelpers';

const displayFieldMappings = {
  cardFront: { validate: isBool },
};

const generateCustomFieldDisplayFragment = (field: string) => {
  return `fragment CustomFieldDisplay${field}Write on CustomField {
    id
    display {
      ${field}
    }
  }`;
};

const generateCustomFieldDisplayData = (
  id: string,
  field: string,
  value: unknown,
) => {
  return {
    __typename: 'CustomField',
    id,
    display: {
      __typename: 'CustomField_Display',
      [field]: value,
    },
  };
};

const scalarFieldMappings = {
  name: { validate: isString },
  position: { validate: isNumber, key: 'pos' },
  // the native type is a string, but the non-native type is an enum
  type: {
    validate: (value: unknown) =>
      isEnumString(value, ['checkbox', 'number', 'list', 'date', 'text']),
    sendValueToSentry: true,
  },
};

const generateCustomFieldOptionValueFragment = () => {
  return `fragment CustomFieldOptionValueWrite on CustomField_Option {
    id
    value {
      text
    }
  }`;
};

const generateCustomFieldOptionValueData = (
  id: string,
  field: string,
  value: unknown,
) => {
  return {
    __typename: 'CustomField_Option',
    id,
    value: {
      __typename: 'CustomField_Option_Value',
      [field]: value,
    },
  };
};

/**
 * Given native TrelloCustomField data, writes all custom
 * field item data to the CustomField model in the Apollo Cache
 * @param incoming A partial TrelloCustomField model
 * @param cache The cache to write to
 * @param readField A function to read fields from cache references
 */
export const syncTrelloCustomFieldToCustomField = (
  incoming: RecursivePartial<TrelloCustomField>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  try {
    const customFieldId = getObjectIdFromCacheObject(incoming, readField);
    const customField: TargetModel = {
      type: 'CustomField',
      id: customFieldId,
    };

    syncNativeToRestScalars(
      customField,
      scalarFieldMappings,
      incoming,
      cache,
      readField,
    );

    const display = readField<TrelloCustomFieldDisplay>('display', incoming);
    if (display) {
      syncNativeNestedObjectToRest(
        customField,
        displayFieldMappings,
        generateCustomFieldDisplayFragment,
        generateCustomFieldDisplayData,
        display,
        cache,
      );
    }

    const options = readField<TrelloCustomFieldOption[]>('options', incoming);

    if (options) {
      syncNestedModelListReferences(
        customField,
        {
          fieldName: 'options',
          models: options.map((option) => ({
            type: 'CustomField_Option',
            id: getObjectIdFromCacheObject(option, readField),
          })),
        },
        cache,
      );

      options.forEach((option) => {
        const optionId = getObjectIdFromCacheObject(option, readField);
        const optionModel: TargetModel = {
          type: 'CustomField_Option',
          id: optionId,
        };

        const optionFieldMappings: ScalarFieldMapping<TrelloCustomFieldOption> =
          {
            // the native schema is nullable, but the legacy schema is non-nullable
            color: { validate: isString },
            position: { validate: isNumber, key: 'pos' },
          };

        syncNativeToRestScalars<TrelloCustomFieldOption>(
          optionModel,
          optionFieldMappings,
          option,
          cache,
          readField,
        );

        const optionValue = readField<TrelloCustomFieldOptionValue>(
          'value',
          option,
        );

        if (optionValue) {
          syncNativeNestedObjectToRest(
            optionModel,
            {
              text: { validate: isString },
            },
            generateCustomFieldOptionValueFragment,
            generateCustomFieldOptionValueData,
            optionValue,
            cache,
          );
        }
      });
    }
  } catch (err) {
    sendErrorEvent(err);
  }
};
