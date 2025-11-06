import { Invitation } from 'app/scripts/models/Invitation';

class OrganizationInvitation extends Invitation {
  static initClass() {
    this.prototype.typeName = 'OrganizationInvitation';
  }
}
OrganizationInvitation.initClass();

export { OrganizationInvitation };
