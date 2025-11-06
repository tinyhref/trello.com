// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';
import type { Organization } from 'app/scripts/models/Organization';

interface TagAttributes extends TrelloModelAttributes {
  typeName: 'Tag';
}

class Tag extends TrelloModel<TagAttributes> {
  static initClass() {
    this.prototype.typeName = 'Tag';
  }
  urlRoot() {
    return `${this.getOrganization().url()}/tags`;
  }

  getOrganization(): Organization {
    // @ts-expect-error
    return this.collection.sourceModel;
  }
}
Tag.initClass();

export { Tag };
