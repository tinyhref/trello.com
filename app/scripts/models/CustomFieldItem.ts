/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { ModelCache } from 'app/scripts/db/ModelCache';
// eslint-disable-next-line no-restricted-imports -- legacy code
import { Dates } from 'app/scripts/lib/dates';
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

const DEBOUNCE_INTERVAL = 500; //ms

interface CustomFieldItemAttributes extends TrelloModelAttributes {
  idCustomField: string;
  idModel: string;
  typeName: 'CustomFieldItem';
}

class CustomFieldItem extends TrelloModel<CustomFieldItemAttributes> {
  static initClass() {
    this.prototype.typeName = 'CustomFieldItem';

    // @ts-expect-error
    this.colors = [
      'green',
      'yellow',
      'orange',
      'red',
      'purple',
      'blue',
      'sky',
      'lime',
      'pink',
      'black',
      'none',
    ];
  }
  url() {
    const idCard = this.get('idModel');
    const idCustomField = this.get('idCustomField');
    return `/1/card/${idCard}/customField/${idCustomField}/item`;
  }

  getCard() {
    return ModelCache.get('Card', this.get('idModel'))!;
  }

  getCustomField() {
    return ModelCache.get('CustomField', this.get('idCustomField'))!;
  }

  clearValue() {
    return this.setValue(null);
  }

  // @ts-expect-error
  setValue(newValue) {
    // default key for payload
    let valueKey = 'value';
    const fieldType = this.getType();

    if (fieldType === 'list') {
      valueKey = 'idValue';
    }

    return this.update(
      {
        [valueKey]: newValue,
      },
      { debounceSaveInterval: DEBOUNCE_INTERVAL },
    );
  }

  // @ts-expect-error
  sync(method, model, options) {
    // we want to ensure that we always use PUT
    // so that when creating a custom field item it is treated more
    // as an update to the card
    // The expectation is this is just used for creation, for updates and deletes
    // use the setValue and clearValue methods instead
    options.type = 'PUT';
    return super.sync(...arguments);
  }

  getType() {
    return this.getCustomField()?.get('type');
  }

  getColor() {
    if (this.getType() === 'list') {
      // @ts-expect-error
      const idValue = this.get('idValue');
      return this.getCustomField().getOption(idValue)?.get('color') || 'none';
    } else {
      // @ts-expect-error
      return this.get('color') || 'none';
    }
  }

  getParsedValue() {
    // @ts-expect-error
    const value = this.get('value');
    // @ts-expect-error
    const idValue = this.get('idValue');
    const type = this.getType();
    switch (type) {
      case 'checkbox':
        // @ts-expect-error
        return (value != null ? value.checked : undefined) === 'true';
      case 'date':
        // @ts-expect-error
        return new Date(value.date);
      case 'list':
        return (
          this.getCustomField().getOption(idValue)?.get('value').text || ''
        );
      case 'number':
        // @ts-expect-error
        return parseFloat(value.number);
      case 'text':
        // @ts-expect-error
        return (value != null ? value.text : undefined) || '';
      default:
    }
  }

  getFrontBadgeText() {
    const parsedVal = this.getParsedValue();
    const type = this.getType();
    switch (type) {
      case 'checkbox':
        return this.getCustomField().get('name');
      case 'date':
        return Dates.toDateString(parsedVal);
      case 'number':
        return parsedVal.toLocaleString();
      default:
        return parsedVal;
    }
  }

  // For Custom Fields we are interested in searching the following:
  // Have a checked checkbox field whose name matches the search terms
  // Have a text field whose value matches the search terms
  // Have a list field selection whose value matches the search terms
  // Have a numeric field whose value matches the search value
  // @ts-expect-error
  getFilterableWords(fxGetWords) {
    if (this.isEmpty()) {
      return [];
    }

    const parsedVal = this.getParsedValue();
    const type = this.getType();
    if (type === 'number') {
      // this is a bit weird, but we want the filter to work on both
      // the formatted number for example 0.01 as well as the raw number .01
      if (parsedVal < 1 && parsedVal > -1) {
        // @ts-expect-error
        return [this.get('value').number, this.getFrontBadgeText()];
      } else {
        // we want to avoid the formatted ones that aren't just leading 0
        // this is because things like commas are tricky to handle with the filter
        // @ts-expect-error
        return [this.get('value').number];
      }
    }

    if (type !== 'date' && parsedVal) {
      return fxGetWords(this.getFrontBadgeText());
    }

    return [];
  }

  isEmpty() {
    if (this.getType() === 'list') {
      // @ts-expect-error
      return this.get('idValue') == null;
    } else {
      // @ts-expect-error
      return this.get('value') == null;
    }
  }

  showFrontBadge() {
    const customField = this.getCustomField();
    if (!(customField != null ? customField.visible() : undefined)) {
      return false;
    }
    if (!customField.get('display')?.cardFront) {
      return false;
    }
    if (this.isEmpty()) {
      return false;
    }
    if (
      customField.get('type') === 'checkbox' &&
      // @ts-expect-error
      this.get('value')?.checked !== 'true'
    ) {
      return false;
    }
    // @ts-expect-error
    if (customField.isList() && !customField.getOption(this.get('idValue'))) {
      return false;
    }
    return true;
  }
}
CustomFieldItem.initClass();

export { CustomFieldItem };
