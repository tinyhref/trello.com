// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { modelFactory } from 'app/scripts/db/modelFactory';
import type { Enterprise } from 'app/scripts/models/Enterprise';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class EnterpriseList extends CollectionWithHelpers<Enterprise> {
  static initClass() {
    this.prototype.model = modelFactory.getModelClass('Enterprise');
  }

  initialize() {
    this.listenTo(this, 'change:name', this.sort);
  }

  // @ts-expect-error
  comparator(enterprise: Enterprise) {
    return enterprise.get('name');
  }
}
EnterpriseList.initClass();

export { EnterpriseList };
