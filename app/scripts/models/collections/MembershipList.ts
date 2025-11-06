/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { Membership } from 'app/scripts/models/Membership';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

interface MembershipList {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  memberIndex: any;
}

class MembershipList extends CollectionWithHelpers<Membership> {
  static initClass() {
    this.prototype.model = Membership;
  }

  initialize() {
    this.memberIndex = {};

    this.listenTo(this, 'add', (model) => {
      return (this.memberIndex[model.get('idMember')] = model);
    });

    this.listenTo(this, 'remove', (model) => {
      return delete this.memberIndex[model.get('idMember')];
    });

    return this.listenTo(this, 'reset', () => {
      this.memberIndex = {};
      return Array.from(this.models).map(
        (membership) =>
          (this.memberIndex[membership.get('idMember')] = membership),
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMember(member: any) {
    const idMember =
      (member != null ? member.id : undefined) != null
        ? member != null
          ? member.id
          : undefined
        : member;
    return this.memberIndex[idMember];
  }
}
MembershipList.initClass();

export { MembershipList };
