// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { customFieldsId as CUSTOM_FIELDS_ID } from '@trello/config';

import { ModelCache } from 'app/scripts/db/ModelCache';
import { Util } from 'app/scripts/lib/util';
import { CustomFieldOptionList } from 'app/scripts/models/collections/CustomFieldOptionList';
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

type CustomFieldType = 'checkbox' | 'date' | 'list' | 'number' | 'text';

interface CustomFieldAttributes extends TrelloModelAttributes {
  idModel: string;
  display: {
    cardFront: boolean;
  };
  name: string;
  isSuggestedField: boolean;
  typeName: 'CustomField';
  type: CustomFieldType;
  pos: number;
}

class CustomField extends TrelloModel<CustomFieldAttributes> {
  static types: CustomFieldType[];
  // @ts-expect-error
  urlRoot: string;

  static initClass() {
    this.prototype.typeName = 'CustomField';
    this.prototype.urlRoot = '/1/customFields';

    this.types = ['checkbox', 'date', 'list', 'number', 'text'];

    this.lazy({
      optionList() {
        return new CustomFieldOptionList().syncSubModels(this, 'options', true);
      },
    });
  }

  getBoard() {
    return ModelCache.get('Board', this.get('idModel'))!;
  }

  getOption(idOption: string) {
    // @ts-expect-error
    return this.optionList.get(idOption);
  }

  getOptionByCId(cid: string) {
    // @ts-expect-error
    return _.find(this.optionList.models, (o) => o.cid === cid);
  }

  editable() {
    return this.visible() && this.getBoard().editable();
  }

  visible() {
    return this.pluginEnabled();
  }

  pluginEnabled(): boolean {
    return this.getBoard().isPluginEnabled(CUSTOM_FIELDS_ID);
  }

  icon() {
    switch (this.get('type')) {
      case 'text':
        return 'text';
      case 'number':
        return 'number';
      case 'date':
        return 'calendar';
      case 'checkbox':
        return 'selection-mode';
      case 'list':
        return 'dropdown-options';
      default:
        return '';
    }
  }

  // @ts-expect-error
  calcPos(index, option) {
    // @ts-expect-error
    return Util.calcPos(index, this.optionList, option);
  }

  // @ts-expect-error
  move(index) {
    this.update('pos', Util.calcPos(index, this.collection, this));
    this.collection.sort({ silent: false });
  }

  isList() {
    return this.get('type') === 'list';
  }

  isSortable() {
    return this.get('type') === 'number' || this.get('type') === 'date';
  }

  // @ts-expect-error
  toggleDisplay(traceId, next) {
    // @ts-expect-error
    return this.update(
      {
        traceId,
        'display/cardFront': !this.get('display')?.cardFront,
      },
      next,
    );
  }
}
CustomField.initClass();

export { CustomField };
