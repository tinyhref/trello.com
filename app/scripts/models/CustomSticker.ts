import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

class CustomSticker extends TrelloModel<TrelloModelAttributes> {
  static initClass() {
    this.prototype.typeName = 'CustomSticker';
  }
}
CustomSticker.initClass();

export { CustomSticker };
