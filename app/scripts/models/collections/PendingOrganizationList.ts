import { PendingOrganization } from 'app/scripts/models/PendingOrganization';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class PendingOrganizationList extends CollectionWithHelpers<PendingOrganization> {
  static initClass() {
    this.prototype.model = PendingOrganization;
  }
}
PendingOrganizationList.initClass();

export { PendingOrganizationList };
