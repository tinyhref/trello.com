import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

interface MembershipAttributes extends TrelloModelAttributes {
  idMember: string;
  memberType: string;
}

class Membership extends TrelloModel<MembershipAttributes> {
  static initClass() {
    this.prototype.typeName = 'Membership';
  }
}
Membership.initClass();

export { Membership };
