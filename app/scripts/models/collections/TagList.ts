// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { Tag } from 'app/scripts/models/Tag';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class TagList extends CollectionWithHelpers<Tag> {
  static initClass() {
    this.prototype.model = Tag;
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparator(tag1: any, tag2: any) {
    return tag1.get('name').localeCompare(tag2.get('name'));
  }
}
TagList.initClass();

export { TagList };
