import { ModelCache } from 'app/scripts/db/ModelCache';
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

interface BoardStarAttributes extends TrelloModelAttributes {
  idBoard: string;
  pos: string;
}

class BoardStar extends TrelloModel<BoardStarAttributes> {
  static initClass() {
    this.prototype.typeName = 'BoardStar';
  }
  getBoard() {
    return ModelCache.get('Board', this.get('idBoard'));
  }
}
BoardStar.initClass();

export { BoardStar };
