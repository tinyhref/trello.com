/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { Util } from 'app/scripts/lib/util';
import { Board } from 'app/scripts/models/Board';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class BoardList extends CollectionWithHelpers<Board> {
  static initClass() {
    this.prototype.model = Board;
  }

  initialize() {
    // @ts-expect-error
    this.comparatorCache = {};
    this.listenTo(this, 'change:name change:idOrganization', () => {
      // @ts-expect-error
      this.comparatorCache = {};
      return this.sort;
    });
  }

  // @ts-expect-error
  comparator(board) {
    const boardId = board.id;
    // @ts-expect-error
    let ret = this.comparatorCache[boardId];
    if (!ret) {
      // Sort by org name, then board name
      const org = board.getOrganization();
      const orgName = (org ? org.get('displayName') : undefined) || '';
      const boardName = board.get('name') || '';
      // @ts-expect-error
      ret = this.comparatorCache[boardId] =
        // @ts-expect-error
        Util.rpad(orgName, 64).toUpperCase() + boardName.toUpperCase();
    }

    return ret;
  }
}
BoardList.initClass();

export { BoardList };
