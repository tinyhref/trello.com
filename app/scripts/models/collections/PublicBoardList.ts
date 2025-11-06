// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { Board } from 'app/scripts/models/Board';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class PublicBoardList extends CollectionWithHelpers<Board> {
  static initClass() {
    this.prototype.model = Board;
  }
}
PublicBoardList.initClass();

export { PublicBoardList };
