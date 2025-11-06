import { BoardPlugin } from 'app/scripts/models/BoardPlugin';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

class BoardPluginList extends CollectionWithHelpers<BoardPlugin> {
  static initClass() {
    this.prototype.model = BoardPlugin;
  }

  // @ts-expect-error
  initialize(list, { board }) {
    // @ts-expect-error
    return (this.board = board);
  }

  url() {
    // @ts-expect-error
    return `/1/boards/${this.board.id}/boardPlugins`;
  }
}
BoardPluginList.initClass();

export { BoardPluginList };
