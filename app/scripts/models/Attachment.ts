/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

// eslint-disable-next-line no-restricted-imports
import parseURL from 'url-parse';

import type { Preview } from '@trello/image-previews';
import {
  biggestPreview,
  previewBetween,
  smallestPreview,
  smallestPreviewBiggerThan,
} from '@trello/image-previews';

import { Util } from 'app/scripts/lib/util';
import type { Card } from 'app/scripts/models/Card';
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

interface AttachmentAttributes extends TrelloModelAttributes {
  mimeType: string;
  name: string;
  previews: Preview[];
  isUpload: string;
  typeName: 'Attachment';
  bytes: number;
  date: string;
}

class Attachment extends TrelloModel<AttachmentAttributes> {
  static initClass() {
    this.prototype.typeName = 'Attachment';
  }
  urlRoot() {
    const card = this.getCard();
    // @ts-expect-error
    return card ? `${card.url()}/attachments` : null;
  }

  getCard(): Card | null {
    // @ts-expect-error
    return this.collection ? this.collection.sourceModel : null;
  }
  editable() {
    const card = this.getCard();
    return card ? card.editable() : false;
  }

  smallestPreviewBiggerThan(width: number, height: number) {
    return smallestPreviewBiggerThan(this.get('previews'), width, height);
  }

  previewBetween(
    minWidth: number,
    minHeight: number,
    maxWidth: number,
    maxHeight: number,
  ) {
    return previewBetween(
      this.get('previews'),
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
    );
  }

  biggestPreview() {
    return biggestPreview(this.get('previews'));
  }

  smallestPreview() {
    return smallestPreview(this.get('previews'));
  }

  getType() {
    let left;
    return (left = Util.fileExt(this.get('name'))) != null
      ? left
      : this.get('mimeType');
  }

  getServiceKey() {
    if (this.get('isUpload')) {
      return 'trello';
    }

    const { host } = parseURL(this.get('url'));

    const services: {
      [key: string]: 'box' | 'dropbox' | 'gdrive' | 'onedrive';
    } = {
      'docs.google.com': 'gdrive',
      'drive.google.com': 'gdrive',
      'www.dropbox.com': 'dropbox',
      'onedrive.live.com': 'onedrive',
      '1drv.ms': 'onedrive',
      'app.box.com': 'box',
    };

    return services[host] != null ? services[host] : 'other';
  }
}
Attachment.initClass();

export { Attachment };
