// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { modelFactory } from 'app/scripts/db/modelFactory';
import { Util } from 'app/scripts/lib/util';
import type { List } from 'app/scripts/models/List';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

interface ListList {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  board: any;
}

class ListList extends CollectionWithHelpers<List> {
  static initClass() {
    this.prototype.model = modelFactory.getModelClass('List');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(models: any, options: any) {
    this.listenTo(this, 'change:pos', this.sort);
    this.board = options.board;
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparator(list: any) {
    return list.get('pos') || 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calcPos(index: any, list: any, includeList: any) {
    return Util.calcPos(index, this, list, null, includeList);
  }

  url() {
    return `/1/boards/${this.board.id}/lists`;
  }
}
ListList.initClass();

export { ListList };
