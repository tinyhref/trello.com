// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { Invitation } from 'app/scripts/models/Invitation';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

interface InvitationList {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any;
}

class InvitationList extends CollectionWithHelpers<Invitation> {
  static initClass() {
    this.prototype.model = Invitation;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(list: any, options: any) {
    this.options = options;
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparator(invitation: any) {
    if (invitation.get('dateExpires')) {
      return -new Date(invitation.get('dateExpires'));
    } else {
      return -Infinity;
    }
  }
}
InvitationList.initClass();

export { InvitationList };
