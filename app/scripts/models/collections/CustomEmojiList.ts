import { CustomEmoji } from 'app/scripts/models/CustomEmoji';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class CustomEmojiList extends CollectionWithHelpers<CustomEmoji> {
  static initClass() {
    this.prototype.model = CustomEmoji;
  }
  url() {
    // @ts-expect-error
    return `/1/member/${this.member.id}/customEmoji`;
  }

  // @ts-expect-error
  initialize(list, { member }) {
    // @ts-expect-error
    this.member = member;
  }
}
CustomEmojiList.initClass();

export { CustomEmojiList };
