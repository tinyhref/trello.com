import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

class Sticker extends TrelloModel<TrelloModelAttributes> {
  static initClass() {
    this.prototype.typeName = 'Sticker';
  }
}
Sticker.initClass();

export { Sticker };
