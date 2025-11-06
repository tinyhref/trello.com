// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { Checklist } from 'app/scripts/models/Checklist';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class ChecklistList extends CollectionWithHelpers<Checklist> {
  static initClass() {
    this.prototype.model = Checklist;
  }
  initialize() {
    return this.listenTo(this, 'change:pos', this.sort);
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparator(checklist: any) {
    return checklist.get('pos');
  }

  idList() {
    return this.pluck('id');
  }
}
ChecklistList.initClass();

export { ChecklistList };
