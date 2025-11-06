import type { Action } from 'app/scripts/models/Action';
import type { Board } from 'app/scripts/models/Board';
import type { BoardPlugin } from 'app/scripts/models/BoardPlugin';
import type { Card } from 'app/scripts/models/Card';
import type { Checklist } from 'app/scripts/models/Checklist';
import type { CustomField } from 'app/scripts/models/CustomField';
import type { CustomFieldItem } from 'app/scripts/models/CustomFieldItem';
import type { Enterprise } from 'app/scripts/models/Enterprise';
import type { Label } from 'app/scripts/models/Label';
import type { List } from 'app/scripts/models/List';
import type { Member } from 'app/scripts/models/Member';
import type { Organization } from 'app/scripts/models/Organization';
import type { PendingOrganization } from 'app/scripts/models/PendingOrganization';
import type { Plugin } from 'app/scripts/models/Plugin';
import type { PluginData } from 'app/scripts/models/PluginData';
import type { Reaction } from 'app/scripts/models/Reaction';

const modelRegistry: {
  Action: typeof Action | null;
  Board: typeof Board | null;
  BoardPlugin: typeof BoardPlugin | null;
  Card: typeof Card | null;
  Checklist: typeof Checklist | null;
  CustomField: typeof CustomField | null;
  CustomFieldItem: typeof CustomFieldItem | null;
  Enterprise: typeof Enterprise | null;
  Label: typeof Label | null;
  List: typeof List | null;
  Member: typeof Member | null;
  Organization: typeof Organization | null;
  PendingOrganization: typeof PendingOrganization | null;
  Plugin: typeof Plugin | null;
  PluginData: typeof PluginData | null;
  Reaction: typeof Reaction | null;
} = {
  Action: null,
  Board: null,
  BoardPlugin: null,
  Card: null,
  Checklist: null,
  CustomField: null,
  CustomFieldItem: null,
  Enterprise: null,
  Label: null,
  List: null,
  Member: null,
  Organization: null,
  PendingOrganization: null,
  Plugin: null,
  PluginData: null,
  Reaction: null,
};

type ModelName = keyof typeof modelRegistry;

export const modelFactory = {
  registerModelClass<T extends ModelName>(
    modelName: T,
    modelClass: NonNullable<(typeof modelRegistry)[T]>,
  ) {
    modelRegistry[modelName] = modelClass;
  },
  getModelClass<T extends ModelName>(
    modelName: T,
  ): NonNullable<(typeof modelRegistry)[T]> {
    const modelClass = modelRegistry[modelName];
    if (!modelClass) {
      throw new Error(
        `You attempted to retrieve the "${modelName}" model before it was registered. This is not allowed.`,
      );
    }
    return modelClass;
  },
};
