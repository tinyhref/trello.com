import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

class BoardBackground extends TrelloModel<TrelloModelAttributes> {
  static initClass() {
    this.prototype.typeName = 'CustomBoardBackground';
  }
}
BoardBackground.initClass();

export { BoardBackground };
