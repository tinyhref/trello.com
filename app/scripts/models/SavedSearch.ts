import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

class SavedSearch extends TrelloModel<TrelloModelAttributes> {
  static initClass() {
    this.prototype.typeName = 'SavedSearch';
  }
}
SavedSearch.initClass();

export { SavedSearch };
