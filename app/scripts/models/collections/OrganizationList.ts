// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { modelFactory } from 'app/scripts/db/modelFactory';
import type { Organization } from 'app/scripts/models/Organization';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class OrganizationList extends CollectionWithHelpers<Organization> {
  static initClass() {
    this.prototype.model = modelFactory.getModelClass('Organization');
  }
  initialize() {
    this.listenTo(this, 'change:name', this.sort);
  }

  // @ts-expect-error
  comparator(organization: Organization) {
    return organization.get('name')?.toUpperCase() || '';
  }
}
OrganizationList.initClass();

export { OrganizationList };
