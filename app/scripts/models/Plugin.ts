import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

interface PluginAttributes extends TrelloModelAttributes {
  author: string;
  capabilities: string[];
  categories: string[];
  deprecation: {
    sunsetDate: string;
  };
  name: string;
  idOrganizationOwner: string;
  icon?: {
    url?: string;
  };
  isCompliantWithPrivacyStandards: boolean;
  public: boolean;
  listing?: {
    name?: string;
  };
  privacyUrl: string;
  iframeConnectorUrl?: string;
  moderatedState: 'hidden' | 'moderated';
  supportEmail: string;
  tags: (
    | 'dark-mode'
    | 'essential'
    | 'featured'
    | 'integration'
    | 'made-by-trello'
    | 'promotional'
    | 'staff-pick'
  )[];
}

class Plugin extends TrelloModel<PluginAttributes> {
  static initClass() {
    this.prototype.typeName = 'Plugin';
  }
}
Plugin.initClass();

export { Plugin };
