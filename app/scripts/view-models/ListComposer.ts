/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { LocalStorageModel } from 'app/scripts/view-models/internal/LocalStorageModel';

export interface ListComposer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  board: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  waitForId: any;
}

export class ListComposer extends LocalStorageModel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(board: any, options: any) {
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 2.
    super(null, options);
    this.board = board;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.waitForId(this.board, (idBoard: any) => {
      this.set({ id: `boardListComposerSettings-${idBoard}` });
      return this.fetch();
    });
  }

  default() {
    return {
      title: null,
      vis: false,
    };
  }

  clear() {
    return this.save(this.default());
  }

  clearItems() {
    this.save({
      title: '',
    });
  }

  getBoard() {
    return this.board;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(param?: any) {
    if (param == null) {
      param = {};
    }
    const { board } = param;
    // @ts-expect-error TS(2556): A spread argument must either have a tuple type or... Remove this comment to see the full error message
    const json = super.toJSON(...arguments);
    if (board) {
      json.board = this.getBoard().toJSON();
    }
    return json;
  }
}
