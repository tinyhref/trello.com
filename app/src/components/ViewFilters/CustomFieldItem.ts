/*
The following class is a repurposed version of CustomFieldItem in app/scripts/models/custom-field-item.js
The key necessity is mapping between CustomFields and CustomFieldItems, which requires a little
more logic outside of the Backbone model framework.
*/

import { customFieldsId } from '@trello/config';
import { formatHumanDate } from '@trello/dates/i18n';
import { intl } from '@trello/i18n';

import { getWords } from 'app/src/satisfiesFilter';
import type {
  BoardPlugins,
  CustomFieldItem as CustomFieldItemType,
  CustomField as CustomFieldType,
} from './types';

export class CustomFieldItem {
  public value;
  public idValue;
  public idCustomField;

  constructor({ value, idValue, idCustomField }: CustomFieldItemType) {
    this.value = value ?? null;
    this.idValue = idValue;
    this.idCustomField = idCustomField;
  }

  getCustomField(customFields: CustomFieldType[]) {
    return customFields.find(({ id }) => id === this.idCustomField);
  }

  getParsedValue({ options, type }: CustomFieldType) {
    switch (type) {
      case 'checkbox':
        return (
          (this.value !== null ? this.value?.checked : undefined) === 'true'
        );
      case 'date':
        return new Date(this.value?.date!);
      case 'list':
        return options?.find(({ id }) => id === this.idValue)?.value.text;
      case 'number':
        return parseFloat(this.value?.number!);
      case 'text':
        return (this.value !== null ? this.value?.text : undefined) || '';
      default:
        return undefined;
    }
  }

  isEmpty(type: string) {
    if (type === 'list') {
      return this.idValue === null;
    } else {
      return this.value === null;
    }
  }

  getFrontBadgeText(customField: CustomFieldType) {
    const parsedVal = this.getParsedValue(customField);

    const type = customField.type;

    switch (type) {
      case 'checkbox':
        return customField.name;
      case 'date':
        return formatHumanDate(parsedVal as Date);
      case 'number':
        return parsedVal ? intl.formatNumber(parsedVal as number) : null;
      default:
        return parsedVal;
    }
  }

  getFilterableWords(customField: CustomFieldType) {
    if (this.isEmpty(customField.type)) {
      return [];
    }

    const parsedVal = this.getParsedValue(customField);
    const type = customField.type;

    if (type === 'number' && typeof parsedVal === 'number') {
      const value = this.value;

      // this is a bit weird, but we want the filter to work on both
      // the formatted number for example 0.01 as well as the raw number .01
      if (parsedVal < 1 && parsedVal > -1) {
        return [value?.number, this.getFrontBadgeText(customField)];
      } else {
        // we want to avoid the formatted ones that aren't just leading 0
        // this is because things like commas are tricky to handle with the filter
        return [value?.number];
      }
    }

    if (type !== 'date' && parsedVal) {
      return getWords(this.getFrontBadgeText(customField)?.toString());
    }

    return [];
  }
}

export const isCustomFieldsEnabled = (boardPlugins: BoardPlugins) => {
  if (!boardPlugins) {
    return false;
  }

  return boardPlugins.some(({ idPlugin }) => idPlugin === customFieldsId);
};
