// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

interface CustomFieldOptionAttributes extends TrelloModelAttributes {
  typeName: 'CustomFieldOption';
}

class CustomFieldOption extends TrelloModel<CustomFieldOptionAttributes> {
  static initClass() {
    this.prototype.typeName = 'CustomFieldOption';
  }
  urlRoot() {
    const customField = this.getCustomField();
    return `/1/customField/${customField.id}/options`;
  }

  getCustomField() {
    // @ts-expect-error
    return this.collection.sourceModel;
  }

  // @ts-expect-error
  move(index) {
    // @ts-expect-error
    this.update('pos', this.getCustomField().calcPos(index, this));
    this.collection.sort({ silent: false });
  }
}
CustomFieldOption.initClass();

export { CustomFieldOption };
