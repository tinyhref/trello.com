import { customFieldsId as CUSTOM_FIELDS_POWER_UP_ID } from '@trello/config';

import { BUTLER_POWER_UP_ID } from 'app/scripts/data/butler-id';
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

interface BoardPluginAttributes extends TrelloModelAttributes {
  idPlugin: string;
  name: string;
  listing: {
    overview: string;
  };
  icon: string;
  claimedDomains: [string];
}

class BoardPlugin extends TrelloModel<BoardPluginAttributes> {
  static initClass() {
    this.prototype.typeName = 'BoardPlugin';
  }

  isButler(): boolean {
    return this.get('idPlugin') === BUTLER_POWER_UP_ID;
  }

  isCustomFields(): boolean {
    return this.get('idPlugin') === CUSTOM_FIELDS_POWER_UP_ID;
  }
}
BoardPlugin.initClass();

export { BoardPlugin };
