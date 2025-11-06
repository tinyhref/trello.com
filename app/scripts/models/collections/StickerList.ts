/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { Sticker } from 'app/scripts/models/Sticker';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

interface StickerList {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  card: any;
}

class StickerList extends CollectionWithHelpers<Sticker> {
  static initClass() {
    this.prototype.model = Sticker;
  }
  url() {
    return `/1/cards/${this.card.get('id')}/stickers`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(list: any, { card }: any) {
    this.card = card;
    this.listenTo(this, 'change:zIndex', this.sort);
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparator(sticker: any) {
    return sticker.get('zIndex') || 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nextZIndex(model: any) {
    if (this.length > 0) {
      const currentMax = _.max(this.pluck('zIndex'));

      // If the specified model is already at the max, and nothing else is
      // return the current max
      if (
        (model != null ? model.get('zIndex') : undefined) === currentMax &&
        // @ts-expect-error
        this.filter((s) => s.get('zIndex') === currentMax).length === 1
      ) {
        return currentMax;
      } else {
        return currentMax + 1;
      }
    } else {
      return 1;
    }
  }
}
StickerList.initClass();

export { StickerList };
