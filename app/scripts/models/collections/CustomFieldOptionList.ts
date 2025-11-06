// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { CustomFieldOption } from 'app/scripts/models/CustomFieldOption';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class CustomFieldOptionList extends CollectionWithHelpers<CustomFieldOption> {
  static initClass() {
    this.prototype.model = CustomFieldOption;
  }
  initialize() {
    return this.listenTo(this, 'change:pos', this.sort);
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparator(option: any) {
    return option.get('pos');
  }
}
CustomFieldOptionList.initClass();

export { CustomFieldOptionList };
