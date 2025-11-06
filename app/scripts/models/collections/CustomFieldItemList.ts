// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { CustomFieldItem } from 'app/scripts/models/CustomFieldItem';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class CustomFieldItemList extends CollectionWithHelpers<CustomFieldItem> {
  static initClass() {
    this.prototype.model = CustomFieldItem;
  }
}
CustomFieldItemList.initClass();

export { CustomFieldItemList };
