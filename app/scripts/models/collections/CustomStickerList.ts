// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { Auth } from 'app/scripts/db/Auth';
import { CustomSticker } from 'app/scripts/models/CustomSticker';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

interface CustomStickerList {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  member: any;
}

class CustomStickerList extends CollectionWithHelpers<CustomSticker> {
  static initClass() {
    this.prototype.model = CustomSticker;
  }
  url() {
    return `/1/member/${Auth.me().id}/customStickers`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(list: any, { member }: any) {
    this.member = member;
  }
}
CustomStickerList.initClass();

export { CustomStickerList };
