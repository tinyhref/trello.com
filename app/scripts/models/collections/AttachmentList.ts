// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line no-restricted-imports -- legacy code
import { Dates } from 'app/scripts/lib/dates';
import { Attachment } from 'app/scripts/models/Attachment';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class AttachmentList extends CollectionWithHelpers<Attachment> {
  static initClass() {
    this.prototype.model = Attachment;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(models: any, options: any) {
    return this.listenTo(this, 'change:pos', this.sort);
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparator(attachment: any) {
    return attachment.get('pos') || Dates.parse(attachment.get('date'));
  }
}
AttachmentList.initClass();

export { AttachmentList };
