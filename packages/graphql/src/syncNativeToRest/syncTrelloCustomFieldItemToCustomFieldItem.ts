import { type InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';

import type { TrelloCustomFieldItemValueInfo } from '../generated';
import { type TrelloCustomFieldItem } from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { InvalidIdError } from './cacheSyncingErrors';
import {
  extractObjectIdFromAri,
  getObjectIdFromCacheObject,
} from './getObjectIdFromCacheObject';
import { syncNativeNestedObjectToRest } from './syncNativeNestedObjectToRest';
import { syncNestedModelReference } from './syncNestedModelReference';
import {
  isBool,
  isNumber,
  isObjectId,
  isString,
  nullOrBool,
  nullOrNumber,
  nullOrString,
} from './validateHelpers';

/* For syncing dropdown custom fields */
const dropdownValueFieldMappings = {
  objectId: { validate: (val: unknown) => val === null || isObjectId(val) },
};

const generateDropdownCustomFieldItemValueFragment = (field: string) => {
  return `fragment CustomFieldItemValueWrite on CustomFieldItem {
    id
    idValue
    value
  }`;
};

const generateDropdownCustomFieldItemValueData = (
  id: string,
  field: string,
  value: unknown,
) => {
  return {
    __typename: 'CustomFieldItem',
    id,
    idValue: value,
    value: null,
  };
};

/* For syncing non-dropdown custom fields */
const valueFieldMappings = {
  checked: {
    validate: nullOrBool,
    transform: (val: boolean | null) => (isBool(val) ? val.toString() : val),
  },
  date: { validate: nullOrString },
  number: {
    validate: nullOrNumber,
    transform: (val: number | null) => (isNumber(val) ? val.toString() : val),
  },
  text: { validate: nullOrString },
  // For non-dropdown custom fields, value.objectId should always be null
  objectId: {
    validate: (val: unknown) => val === null,
    generateFragment:
      () => `fragment CustomFieldItemValueidValueWrite on CustomFieldItem {
      id
      idValue
    }`,
    generateData: (id: string, value: unknown) => ({
      __typename: 'CustomFieldItem',
      id,
      idValue: value,
    }),
  },
};

const generateCustomFieldItemValueFragment = (field: string) => {
  return `fragment CustomFieldItemValue${field}Write on CustomFieldItem {
    id
    value {
      ${field}
    }
  }`;
};

const generateCustomFieldItemValueData = (
  id: string,
  field: string,
  value: unknown,
) => {
  return {
    __typename: 'CustomFieldItem',
    id,
    value: {
      __typename: 'CustomFieldItem_Value',
      [field]: value,
    },
  };
};

/**
 * Given native TrelloCustomFieldItem data, writes all custom
 * field item data to the CustomFieldItem model in the Apollo Cache
 * @param incoming A partial TrelloBoard model
 * @param cache The cache to write to
 * @param readField A function to read fields from cache references
 */
export const syncTrelloCustomFieldItemToCustomFieldItem = (
  incoming: RecursivePartial<TrelloCustomFieldItem>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  try {
    const customFieldItemId = getObjectIdFromCacheObject(incoming, readField);
    const customFieldItem: TargetModel = {
      type: 'CustomFieldItem',
      id: customFieldItemId,
    };

    const customField = incoming.customField;
    if (customField) {
      const customFieldId =
        customField.id && extractObjectIdFromAri(customField.id);

      /**
       * It appears that in some cases the customField corresponding to the
       * incoming customFieldItem may not already be synced, leading to
       * an undefined value for the objectId field. In this case, we do not
       * want to sync the customField.idCustomField. However after the
       * customField is synced, the customFieldItem cache syncing appears
       * to run again and then the customField.idCustomField is defined.
       */
      if (customFieldId && !isObjectId(customFieldId)) {
        throw new InvalidIdError('TrelloCustomField', customFieldId);
      } else if (customFieldId) {
        syncNestedModelReference(
          customFieldItem,
          {
            model: {
              id: customFieldId,
              type: 'CustomField',
            },
            fieldName: 'customField',
            idFieldName: 'idCustomField',
          },
          cache,
        );
      }
    }

    const value = readField<TrelloCustomFieldItemValueInfo>('value', incoming);

    // This happens when a custom field item is unset (it doesn't get deleted, the value just gets set to null)
    if (value === null) {
      // Both idValue and value should be set to null
      // This is a bit of a hacky way of doing it but it fixes the bug for now
      syncNativeNestedObjectToRest(
        customFieldItem,
        dropdownValueFieldMappings,
        generateDropdownCustomFieldItemValueFragment,
        generateDropdownCustomFieldItemValueData,
        { __typename: 'TrelloCustomFieldItemValueInfo', objectId: null },
        cache,
      );
    } else if (value) {
      const isDropdownCustomField = isString(value.objectId);

      const mappings = isDropdownCustomField
        ? dropdownValueFieldMappings
        : valueFieldMappings;
      const generateFragment = isDropdownCustomField
        ? generateDropdownCustomFieldItemValueFragment
        : generateCustomFieldItemValueFragment;
      const generateData = isDropdownCustomField
        ? generateDropdownCustomFieldItemValueData
        : generateCustomFieldItemValueData;

      syncNativeNestedObjectToRest(
        customFieldItem,
        mappings,
        generateFragment,
        generateData,
        value,
        cache,
      );
    }
  } catch (err) {
    sendErrorEvent(err);
  }
};
