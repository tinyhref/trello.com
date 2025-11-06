import { BoardBackground } from 'app/scripts/models/BoardBackground';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class BoardBackgroundList extends CollectionWithHelpers<BoardBackground> {
  static initClass() {
    this.prototype.model = BoardBackground;
  }
  url() {
    // @ts-expect-error
    return `/1/member/${this.member.id}/boardBackgrounds`;
  }

  // @ts-expect-error
  initialize(list, { member }) {
    // @ts-expect-error
    this.member = member;
  }
}
BoardBackgroundList.initClass();

export { BoardBackgroundList };
