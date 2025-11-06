/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import _ from 'underscore';

import { ModelCache } from 'app/scripts/db/ModelCache';
import { Util } from 'app/scripts/lib/util';
import type { Board } from 'app/scripts/models/Board';
import { BoardStar } from 'app/scripts/models/BoardStar';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let getVisibleStarredBoards: any = undefined;

interface BoardStarList {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  member: any;
}

class BoardStarList extends CollectionWithHelpers<BoardStar> {
  static initClass() {
    this.prototype.model = BoardStar;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getVisibleStarredBoards = function (boardStar: any) {
      const board = boardStar.getBoard();
      return board?.isOpen();
    };
  }
  url() {
    return `/1/member/${this.member.id}/boardStars`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(list: any, { member }: any) {
    this.member = member;
    return this.listenTo(this, 'change:pos', this.sort);
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparator(boardStar: any) {
    return boardStar.get('pos') || 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getBoardStar(idBoard: any) {
    return _.find(this.models, (model) => model.get('idBoard') === idBoard);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  starBoard(idBoard: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let pos: any;
    if (this.getBoardStar(idBoard)) {
      return Bluebird.reject(new Error('already starred'));
    }

    if (this.length) {
      pos = this.at(this.length - 1).get('pos') + Util.spacing;
    } else {
      pos = Util.spacing;
    }

    return new Bluebird((resolve) => {
      return this.create(
        {
          idBoard,
          pos,
        },
        // @ts-expect-error
        { modelCache: this.modelCache },
        resolve,
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unstarBoard(idBoard: any) {
    const boardStar = this.getBoardStar(idBoard);
    if (boardStar != null) {
      return new Bluebird(function (resolve, reject) {
        return boardStar.waitForId(boardStar, () =>
          boardStar.destroy({
            success: resolve,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            error(xhr: any, err: any) {
              return reject(err);
            },
          }),
        );
      });
    } else {
      return Bluebird.reject(new Error('not starred'));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateStarBoard(idBoard: any, index: any) {
    const boardStar = this.getBoardStar(idBoard);
    const pos = this.getNewPos(boardStar, index);

    if (boardStar != null) {
      return boardStar.update({
        pos,
      });
    }
  }

  getBoards(): Board[] {
    const idBoards = this.getBoardIds();
    return _.compact(ModelCache.get('Board', idBoards));
  }

  getBoardIds() {
    const models = _.sortBy(this.models, (model) => model.get('pos'));
    return (() => {
      const result = [];
      for (const model of Array.from(models)) {
        result.push(model.get('idBoard'));
      }
      return result;
    })();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getBoardIndex(idBoard: any) {
    return (
      this.models
        .filter(getVisibleStarredBoards)
        // @ts-expect-error
        .indexOf(this.getBoardStar(idBoard))
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNewPos(boardStar: any, index: any) {
    return Util.calcPos(index, this, boardStar, getVisibleStarredBoards);
  }
}
BoardStarList.initClass();

export { BoardStarList };
