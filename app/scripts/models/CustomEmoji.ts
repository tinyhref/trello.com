import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

interface CustomEmojiAttributes extends TrelloModelAttributes {
  name: string;
  url: string;
}

class CustomEmoji extends TrelloModel<CustomEmojiAttributes> {
  static initClass() {
    this.prototype.typeName = 'CustomEmoji';
  }
}
CustomEmoji.initClass();

export { CustomEmoji };
