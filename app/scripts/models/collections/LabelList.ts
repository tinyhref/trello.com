// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { Label } from 'app/scripts/models/Label';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class LabelList extends CollectionWithHelpers<Label> {
  static initClass() {
    this.prototype.model = Label;
  }
}
LabelList.initClass();

export { LabelList };
