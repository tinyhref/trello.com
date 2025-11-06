import { InvitationList } from 'app/scripts/models/collections/InvitationList';
import { OrganizationInvitation } from 'app/scripts/models/OrganizationInvitation';

class OrganizationInvitationList extends InvitationList {
  // @ts-expect-error
  public model: typeof OrganizationInvitation;

  static initClass() {
    this.prototype.model = OrganizationInvitation;
  }
}
OrganizationInvitationList.initClass();

export { OrganizationInvitationList };
