/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line no-restricted-imports -- legacy code
import { Dates } from 'app/scripts/lib/dates';
import type { Board } from 'app/scripts/models/Board';
import type { Card } from 'app/scripts/models/Card';
import type { Checklist } from 'app/scripts/models/Checklist';
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

interface CheckItemAttributes extends TrelloModelAttributes {
  state: 'complete' | 'incomplete';
  pos: number;
  traceId: string;
}

class CheckItem extends TrelloModel<CheckItemAttributes> {
  static initClass() {
    this.prototype.typeName = 'CheckItem';
  }
  urlRoot() {
    const checklist = this.getChecklist();
    // @ts-expect-error
    return `${checklist.getCard().url()}/checklist/${checklist.id}/checkItem`;
  }

  // @ts-expect-error
  sync(method, model, options) {
    // We can't sync our checkItem models until we know the id of the checklist
    // the check item is being added to
    if (this.getChecklist() == null) {
      return;
    }
    return this.waitForId(this.getChecklist(), () => {
      // @ts-expect-error
      return CheckItem.prototype.__proto__.sync.call(
        this,
        method,
        model,
        options,
      );
    });
  }

  getChecklist(): Checklist {
    // @ts-expect-error
    return this.collection?.sourceModel;
  }

  getCard(): Card {
    return this.getChecklist().getCard();
  }

  getBoard(): Board {
    return this.getCard().getBoard();
  }

  editable() {
    return this.getChecklist().editable();
  }

  getContext() {
    return this.getChecklist();
  }

  move(index: number) {
    this.update('pos', this.getChecklist().calcPos(index, this));
    this.collection.sort({ silent: true });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeDueDateMaintainTime(targetDate: Date, traceId: string, next: any) {
    // @ts-expect-error
    const left = this.get('due');
    let oldDateData: Date;
    if (left != null) {
      oldDateData = new Date(left);
    } else {
      oldDateData = new Date();
      oldDateData.setHours(12, 0, 0, 0);
    }
    const newDate = Dates.getDateWithSpecificTime(oldDateData, targetDate);
    // @ts-expect-error
    return this.update({ due: newDate, traceId }, next);
  }
}
CheckItem.initClass();

export { CheckItem };
