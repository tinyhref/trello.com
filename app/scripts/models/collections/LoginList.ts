// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { Login } from 'app/scripts/models/Login';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class LoginList extends CollectionWithHelpers<Login> {
  static initClass() {
    this.prototype.model = Login;
  }

  initialize() {
    return this.listenTo(this, 'change:primary', this.resetPrimary);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resetPrimary(login: any) {
    // If this isn't an event from a login declaring itself the primary, we
    // ignore it.
    if (!login.get('primary')) {
      return;
    }

    // Otherwise unset all other models.
    for (login of Array.from(this.without(login))) {
      login.set('primary', false);
    }
    return this.sort();
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparator(login: any) {
    // We want to show primary first, so a value of true would be 0 and would
    // always come before a value of 1. This is concatenated to the id to sort
    // the rest by creation date.
    return Number(!login.get('primary')) + login.id;
  }

  types() {
    return _.countBy(_.flatten(this.pluck('types')));
  }
}
LoginList.initClass();

export { LoginList };
